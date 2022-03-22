import { ValueObject } from '../base-classes/value-object.base';
import {
  ArgumentInvalidException,
  ArgumentOutOfRangeException,
} from '@appvise/domain';

export interface StatisticsProps {
  [index: symbol]: number;
}

export interface UpdateStatisticsProps {
  [index: symbol]: number | undefined;
}

export class Statistics<
  TStatisticsProps extends StatisticsProps,
  TUpdateStatisticsProps extends UpdateStatisticsProps,
> extends ValueObject<TStatisticsProps> {
  public update(props: TUpdateStatisticsProps): void {
    Object.entries(props).forEach(([key, value]) => {
      // Only update defined values
      if (value !== undefined) {
        if (value < 1) {
          throw new ArgumentOutOfRangeException(
            'Amount to add must be positive',
          );
        }

        console.log([
          'Update stats:',
          this.props[key],
          this.props[key] + value,
          parseInt(this.props[key]),
          parseInt(this.props[key]) + value,
        ]);
        this.props[key] = parseInt(this.props[key]) + value;
      }
    });
  }

  protected validate(props: StatisticsProps): void {
    Object.entries(props).forEach(([key, value]) => {
      if (value < 0) {
        throw new ArgumentInvalidException(
          `Statistics for ${key} must be 0 or greater than 0`,
        );
      }
    });
  }
}
