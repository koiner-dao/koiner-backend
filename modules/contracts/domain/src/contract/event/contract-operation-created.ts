import { DomainEvent, DomainEventProps } from '@appvise/domain';

export class ContractOperationCreated extends DomainEvent {
  constructor(props: DomainEventProps<ContractOperationCreated>) {
    super(props);

    Object.assign(this, props);
  }

  readonly blockHeight!: number;
  readonly contractId!: string;
  readonly transactionId!: string;
  readonly entryPoint!: number;
  readonly args?: string;
  readonly name!: string;
  readonly data?: string;
  readonly contractStandardType?: string;
  readonly timestamp!: number;
}
