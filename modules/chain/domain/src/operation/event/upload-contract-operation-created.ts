import { DomainEvent, DomainEventProps } from '@appvise/domain';

export class UploadContractOperationCreated extends DomainEvent {
  constructor(props: DomainEventProps<UploadContractOperationCreated>) {
    super(props);

    Object.assign(this, props);
  }

  readonly contractId!: string;
  readonly bytecode!: string;
  readonly abi?: string;
  readonly timestamp!: number;
}
