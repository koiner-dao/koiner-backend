import { AggregateRoot } from '@appvise/domain';
import { ContractCreated } from '@koiner/chain/domain';
import { ContractProps, CreateContractProps } from './contract.types';
import { KoinosAddressId, KoinosId } from '@koiner/domain';

export class Contract extends AggregateRoot<ContractProps> {
  protected readonly _id: KoinosId;

  static create(create: CreateContractProps, id: KoinosAddressId): Contract {
    const props: ContractProps = {
      ...create,
    };

    const contract = new Contract({ id, props });

    contract.apply(
      new ContractCreated(
        id.value,
        props.blockHeight,
        props.transactionId.value,
        props.operationIndex,
      ),
    );

    return contract;
  }

  get blockHeight(): number {
    return this.props.blockHeight;
  }

  get transactionId(): KoinosId {
    return this.props.transactionId;
  }

  get operationIndex(): number {
    return this.props.operationIndex;
  }

  get bytecode(): string {
    return this.props.bytecode;
  }

  get abi(): string {
    return this.props.abi;
  }

  validate(): void {
    // TODO: Add validations
  }
}
