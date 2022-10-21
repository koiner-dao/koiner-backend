import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Provider } from 'koilib';
import { BlockReward } from '@koiner/network/domain';
import {
  BlockRewardsQuery,
  UndoBlockRewardsCommand,
  UndoBlockRewardsFromCheckpointCommand,
} from '@koiner/network/application';
import {
  NotFoundException,
  SearchResponse,
  SortDirection,
} from '@appvise/domain';
import { Synchronization } from '@koiner/sync/domain';
import {
  SynchronizationQuery,
  StartSynchronizationCommand,
  UpdateSynchronizationCommand,
} from '@koiner/sync/application';
import { SyncBlockRewardsCommand } from './application';
import { koinos } from '../config';
import { koinosConfig } from '@koinos/jsonrpc';
import { BlockRewardSyncFailedException } from './application/exception';

@Injectable()
export class SyncService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly provider: Provider,
    private readonly logger: Logger
  ) {}

  async sync(batchSize?: number) {
    this.logger.log('Start syncing!');

    let chain: Synchronization | undefined;
    let headInfo;
    batchSize = batchSize ?? koinos.batchSize;

    try {
      chain = await this.queryBus.execute<
        SynchronizationQuery,
        Synchronization
      >(new SynchronizationQuery(koinosConfig.chainId));
    } catch (error: any) {
      // Create Synchronization if not yet already created
      if (error instanceof NotFoundException) {
        headInfo = await this.provider.getHeadInfo();

        // Block where block rewards started
        const startHeight = process.env.CRON_SYNC_START_HEIGHT
          ? parseInt(process.env.CRON_SYNC_START_HEIGHT)
          : 268;

        chain = await this.commandBus.execute(
          new StartSynchronizationCommand({
            id: koinosConfig.chainId,
            headTopology: {
              id: headInfo.head_topology.id,
              previous: headInfo.head_topology.previous,
              height: parseInt(headInfo.head_topology.height),
            },
            lastIrreversibleBlock: parseInt(headInfo.last_irreversible_block),
            lastSyncedBlock: startHeight - 1,
            syncing: false,
          })
        );
      }
    }

    if (!chain || chain.stopped) {
      console.log('Do not sync');

      return;
    }

    if (chain && chain.syncing) {
      console.log('Do not sync, still syncing');

      const syncTimeout = process.env.CRON_SYNC_TIME_OUT
        ? parseInt(process.env.CRON_SYNC_TIME_OUT)
        : 600000;

      if (Date.now() - chain.lastSyncStarted > syncTimeout) {
        console.error(
          `Sync has timed out. Reset sync to last checkpoint: ${chain.lastSyncedBlock}`
        );

        // Remove all blocks after last checkpoint
        await this.commandBus.execute(
          new UndoBlockRewardsFromCheckpointCommand({
            checkPoint: chain.lastSyncedBlock,
          })
        );

        // Set syncing back to false allowing sync to continue
        headInfo = await this.provider.getHeadInfo();

        await this.commandBus.execute(
          new UpdateSynchronizationCommand({
            id: koinosConfig.chainId,
            headTopology: {
              id: headInfo.head_topology.id,
              previous: headInfo.head_topology.previous,
              height: parseInt(headInfo.head_topology.height),
            },
            lastIrreversibleBlock: parseInt(headInfo.last_irreversible_block),
            lastSyncedBlock: chain.lastSyncedBlock,
            syncing: false,
          })
        );

        console.log(
          `Sync has been reset to last checkpoint: ${chain.lastSyncedBlock}`
        );
      }

      return;
    }

    if (!headInfo) {
      headInfo = await this.provider.getHeadInfo();
    }

    const lastIrreversibleBlock = parseInt(headInfo.last_irreversible_block);

    // Update chain info + set syncing flag
    await this.commandBus.execute(
      new UpdateSynchronizationCommand({
        id: koinosConfig.chainId,
        headTopology: {
          id: headInfo.head_topology.id,
          previous: headInfo.head_topology.previous,
          height: parseInt(headInfo.head_topology.height),
        },
        lastIrreversibleBlock,
        lastSyncedBlock: chain.lastSyncedBlock,
        syncing: true,
      })
    );

    const startHeight = parseInt(chain.lastSyncedBlock.toString()) + 1;
    let endBlock = startHeight + (batchSize - 1);

    // Make sure we only process irreversible blocks
    if (endBlock > lastIrreversibleBlock) {
      batchSize = lastIrreversibleBlock - startHeight + 1;
      endBlock = lastIrreversibleBlock;
    }

    // Sync next x blocks
    this.logger.log(
      `Start syncing next batch of ${batchSize} blocks, from ${startHeight} to ${endBlock}`
    );

    let failedBlockHeight: number | undefined;

    try {
      await this.commandBus.execute(
        new SyncBlockRewardsCommand({
          startHeight,
          amount: batchSize,
        })
      );
    } catch (error) {
      if (error instanceof BlockRewardSyncFailedException) {
        console.error(`Sync block failed, undo last block ${error.height}`);

        failedBlockHeight = error.height;

        // Remove failed block
        await this.commandBus.execute(
          new UndoBlockRewardsCommand({
            blockHeights: [error.height],
          })
        );
      } else {
        console.error(
          `Sync block failed. Something completely went wrong!`,
          error
        );
      }
    }

    let lastSyncedBlockHeight: number;

    if (failedBlockHeight) {
      lastSyncedBlockHeight = failedBlockHeight - 1;
    } else {
      // Get highest synced block
      const highestBlock = await this.queryBus.execute<
        BlockRewardsQuery,
        SearchResponse<BlockReward>
      >(
        new BlockRewardsQuery({
          first: 1,
          sort: [
            {
              field: 'blockHeight',
              direction: SortDirection.desc,
            },
          ],
        })
      );

      lastSyncedBlockHeight = highestBlock.results[0].item.blockHeight;
    }

    await this.commandBus.execute(
      new UpdateSynchronizationCommand({
        id: koinosConfig.chainId,
        headTopology: {
          id: headInfo.head_topology.id,
          previous: headInfo.head_topology.previous,
          height: parseInt(headInfo.head_topology.height),
        },
        lastIrreversibleBlock: parseInt(headInfo.last_irreversible_block),
        lastSyncedBlock: lastSyncedBlockHeight,
        syncing: false,
      })
    );

    if (failedBlockHeight) {
      this.logger.error(
        `Failed syncing batch of ${batchSize} blocks, started at ${startHeight}, failed at ${failedBlockHeight}`
      );
    } else {
      this.logger.log(
        `Done syncing batch of ${batchSize} blocks, from ${startHeight} to ${lastSyncedBlockHeight}`
      );
    }
  }
}
