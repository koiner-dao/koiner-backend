import { AggregateRoot } from '@appvise/domain';
import { ChainId } from '@koiner/domain';
import {
  TokenStatsProps,
  TokenStatsUpdated,
  CreateTokenStatsProps,
  UpdateTokenStatsProps,
} from '.';

export class TokenStats extends AggregateRoot<TokenStatsProps> {
  protected readonly _id!: ChainId;

  static create(create: CreateTokenStatsProps, id: ChainId): TokenStats {
    const props: TokenStatsProps = {
      ...create,
      transferCount: 0,
    };

    const tokenStats = new TokenStats({ id, props });

    tokenStats.addEvent(
      new TokenStatsUpdated({
        aggregateId: id.value,
        contractCount: props.contractCount,
        transferCount: props.transferCount,
      })
    );

    return tokenStats;
  }

  get contractCount(): number {
    return this.props.contractCount;
  }

  get transferCount(): number {
    return this.props.transferCount;
  }

  update(props: UpdateTokenStatsProps): void {
    if (props.contractCount) {
      this.props.contractCount += props.contractCount;
    }

    if (props.transferCount) {
      this.props.transferCount += props.transferCount;
    }

    this.addEvent(
      new TokenStatsUpdated({
        aggregateId: this.id.value,
        contractCount: this.contractCount,
        transferCount: this.transferCount,
      })
    );
  }

  undo(props: UpdateTokenStatsProps): void {
    if (props.contractCount !== undefined) {
      this.props.contractCount -= props.contractCount;
    }

    if (props.transferCount !== undefined) {
      this.props.transferCount -= props.transferCount;
    }
  }

  validate(): void {
    //
  }
}
