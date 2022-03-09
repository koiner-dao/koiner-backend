import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UUID } from '@appvise/domain';
import { CreateContractOperationCommand } from './dto/create-contract-operation.command';
import {
  ContractOperation,
  ContractOperationWriteRepository,
} from '@koiner/chain/domain';
import { KoinosAddressId } from '@koiner/domain';

@CommandHandler(CreateContractOperationCommand)
export class CreateContractOperationHandler
  implements ICommandHandler<CreateContractOperationCommand>
{
  constructor(
    private readonly writeRepository: ContractOperationWriteRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateContractOperationCommand): Promise<void> {
    const operation = this.eventPublisher.mergeObjectContext(
      ContractOperation.create(
        {
          contractId: new KoinosAddressId(command.contractId),
          entryPoint: command.entryPoint,
          args: command.args,
        },
        new UUID(command.id),
      ),
    );

    await this.writeRepository.save(operation);

    operation.commit();
  }
}
