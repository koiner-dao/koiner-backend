import { ForbiddenException } from '@nestjs/common';
import { Args, ID, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SelectionSet } from '@appvise/graphql';
import { koinosConfig } from '@koinos/jsonrpc';
import {
  StartSynchronizationBatchCommand,
  SynchronizationQuery,
} from '@koiner/sync/application';
import { Synchronization } from '@koiner/sync/domain';
import { SynchronizationNode } from '../dto';

@Resolver(() => SynchronizationNode)
export class SyncNextBatchResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Mutation(() => SynchronizationNode, {
    name: 'syncNextBatch',
  })
  async execute(
    @SelectionSet() selectionSet: any,
    @Args('secret') secret: string,
    @Args({
      name: 'chainId',
      type: () => ID,
      nullable: true,
      description: 'Leave empty to stop synchronization for koinos chain',
    })
    chainId?: string,
    @Args({ name: 'batchSize', type: () => Int, nullable: true })
    batchSize?: number
  ): Promise<SynchronizationNode> {
    if (
      !secret ||
      !koinosConfig.syncSecret ||
      secret !== koinosConfig.syncSecret
    ) {
      throw new ForbiddenException();
    }

    if (!chainId) {
      chainId = koinosConfig.chainId;
    }

    await this.commandBus.execute(
      new StartSynchronizationBatchCommand({ chainId, batchSize })
    );

    const synchronization = await this.queryBus.execute<
      SynchronizationQuery,
      Synchronization
    >(new SynchronizationQuery(chainId, selectionSet));

    return new SynchronizationNode(synchronization);
  }
}
