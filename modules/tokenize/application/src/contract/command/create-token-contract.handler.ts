import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { KoinosAddressId } from '@koiner/domain';
import {
  TokenContract,
  TokenContractWriteRepository,
} from '@koiner/tokenize/domain';
import { CreateTokenContractCommand } from './dto/create-token-contract.command';

@CommandHandler(CreateTokenContractCommand)
export class CreateTokenContractHandler
  implements ICommandHandler<CreateTokenContractCommand>
{
  constructor(private readonly writeRepository: TokenContractWriteRepository) {}

  async execute(command: CreateTokenContractCommand): Promise<void> {
    const contract = TokenContract.create(
      {
        name: command.name,
        symbol: command.symbol,
        decimals: command.decimals,
        timestamp: command.timestamp,
      },
      new KoinosAddressId(command.id)
    );

    await this.writeRepository.save(contract);
  }
}