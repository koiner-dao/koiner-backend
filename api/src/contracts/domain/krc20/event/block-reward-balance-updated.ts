import { DomainEvent, DomainEventProps } from '@appvise/domain';

export class BlockRewardBalanceUpdated extends DomainEvent {
  constructor(props: DomainEventProps<BlockRewardBalanceUpdated>) {
    super(props);

    Object.assign(this, props);
  }

  readonly addressId: string;
  readonly contractId: string;
  readonly balance: number;
  readonly amountChanged: number;
}
