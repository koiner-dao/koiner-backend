import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
  ContractCreated,
  ContractStandardType,
} from '@koiner/contracts/domain';
import { CreateKrc20ContractCommand } from '@koiner/contracts/application/krc20/command';
import { ContractStandardService } from '@koiner/contracts/application/contract-standard/service';

@EventsHandler(ContractCreated)
export class CreateKrcContractOnContractCreated
  implements IEventHandler<ContractCreated>
{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly contractStandardService: ContractStandardService,
  ) {}

  async handle(event: ContractCreated): Promise<void> {
    if (event.contractStandardType !== ContractStandardType.krc20) {
      return;
    }

    const contractStandardWithValues =
      await this.contractStandardService.getForContract(
        event.contractId,
        event.contractStandardType,
      );
    const contractValues = contractStandardWithValues.contractValues;

    if (
      contractValues.name &&
      contractValues.symbol &&
      contractValues.decimals
    ) {
      await this.commandBus.execute(
        new CreateKrc20ContractCommand(
          event.contractId,
          event.blockHeight,
          event.transactionId,
          event.operationIndex,
          <string>contractValues.name,
          <string>contractValues.symbol,
          <number>contractValues.decimals,
        ),
      );
    }
  }
}
