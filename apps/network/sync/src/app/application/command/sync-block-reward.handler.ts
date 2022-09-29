import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { Logger } from '@appvise/domain';
import { koinosConfig, RawBlocksService } from '@koinos/jsonrpc';
import { SyncBlockRewardCommand } from './dto/sync-block-reward.command';
import { CreateBlockRewardCommand } from '@koiner/network/application';
import * as math from 'mathjs';
import {
  ContractStandardService,
  ContractStandardType,
} from '@koiner/contracts/standards';

@CommandHandler(SyncBlockRewardCommand)
export class SyncBlockRewardHandler
  implements ICommandHandler<SyncBlockRewardCommand>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly rawBlocksService: RawBlocksService,
    private readonly contractStandardService: ContractStandardService,
    private readonly logger: Logger
  ) {}

  async execute(command: SyncBlockRewardCommand): Promise<void> {
    try {
      const rawBlock = await this.rawBlocksService.getBlock(
        command.blockHeight
      );

      this.logger.debug(`Height: ${command.blockHeight}`, 'SyncBlockHandler');

      const events = rawBlock.receipt.events;

      if (events && events.length > 1) {
        const mintEvent = events.find((event) => event.name === 'koin.mint');
        const burnEvent = events.find((event) => event.name === 'vhp.burn');

        if (mintEvent && burnEvent) {
          const decodedMintEvent =
            await this.contractStandardService.decodeOperation(
              ContractStandardType.token,
              koinosConfig.contracts.koin,
              0xdc6f17bb, // TODO: Find way to retrieve using contract standards
              mintEvent.data
            );

          const decodedBurnEvent =
            await this.contractStandardService.decodeOperation(
              ContractStandardType.token,
              koinosConfig.contracts.vhp,
              0x859facc5, // TODO: Find way to retrieve using contract standards
              burnEvent.data
            );

          const producerRewards = parseInt(<string>decodedMintEvent.args.value);
          const burnedValue = parseInt(<string>decodedBurnEvent.args.value);

          await this.commandBus.execute(
            new CreateBlockRewardCommand({
              blockId: rawBlock.block_id,
              blockHeight: command.blockHeight,
              producerId: <string>decodedMintEvent.args.to,
              value: producerRewards,
              burnerId: <string>decodedBurnEvent.args.from,
              burnedValue,
              roi: burnedValue
                ? (math
                    .chain<number>(producerRewards)
                    .divide(burnedValue)
                    .multiply(100)
                    .subtract(100)
                    .round(5)
                    .done() as number)
                : undefined,
              timestamp: parseInt(rawBlock.block.header.timestamp),
            })
          );
        }
      }

      this.logger.debug(
        `END BLOCK PROCESSING Height: ${command.blockHeight}`,
        'SyncBlockRewardsHandler'
      );
    } catch (error) {
      this.logger.error(error.message, error.stack, 'Sync-block-rewards error');
    }
  }
}