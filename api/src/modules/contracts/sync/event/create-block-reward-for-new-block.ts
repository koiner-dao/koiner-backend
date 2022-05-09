import { CommandBus } from '@nestjs/cqrs';
import { DomainEventHandler } from '@appvise/domain';
import { AfterBlockCreated } from '@koiner/chain/domain';
import { RawBlocksService } from '@koinos/raw-blocks.service';
import { ContractStandardType } from '@koiner/contracts/domain';
import { Provider, utils } from 'koilib';
import { ContractStandardService } from '@koiner/contracts/application/contract-standard/service';
import { koinos } from '@config';
import { CreateOrUpdateAddressCommand } from '@koiner/chain/application/address/command';
import { CreateBlockRewardCommand } from '@koiner/contracts/application/token/command';

export class CreateBlockRewardForNewBlock extends DomainEventHandler {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly provider: Provider,
    private readonly rawBlocksService: RawBlocksService,
    private readonly contractStandardService: ContractStandardService,
  ) {
    super(AfterBlockCreated);
  }

  async handle(event: AfterBlockCreated): Promise<void> {
    const rawBlock = await this.rawBlocksService.getBlock(event.height);

    if (rawBlock.receipt.events) {
      const mintEvent = rawBlock.receipt.events.find(
        (event) => event.name === 'koin.mint',
      );

      if (mintEvent) {
        // // Decode mint event
        const mintOperation =
          await this.contractStandardService.decodeOperation(
            ContractStandardType.token,
            koinos.koinContractId,
            utils.tokenAbi.methods.mint.entryPoint,
            mintEvent.data,
          );

        const blockProducerId = <string>mintOperation.args.to;
        const producerRewards = parseInt(<string>mintOperation.args.value);

        // Add address for block producer
        await this.commandBus.execute(
          new CreateOrUpdateAddressCommand(blockProducerId, true),
        );

        await this.commandBus.execute(
          new CreateBlockRewardCommand(
            event.height,
            blockProducerId,
            producerRewards,
            koinos.koinContractId,
          ),
        );
      }
    }
  }
}