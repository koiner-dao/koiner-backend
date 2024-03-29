import { DomainEvent, DomainEventProps } from '@appvise/domain';

export class BlockProductionStatsUpdated extends DomainEvent {
  constructor(props: DomainEventProps<BlockProductionStatsUpdated>) {
    super(props);

    Object.assign(this, props);
  }

  readonly contractId!: string;
  readonly rewarded!: number;
  readonly mintedTotal!: number;
  readonly burnedTotal!: number;
  readonly rewardsAdded!: number;
  readonly mintedAdded!: number;
  readonly burnedAdded!: number;
  readonly blocksProduced!: number;
}
