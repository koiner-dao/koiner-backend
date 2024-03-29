import { Command, CommandProps } from '@appvise/domain';
import { SyncSet } from '..';

export class SyncBlockSetsCommand extends Command {
  constructor(props: CommandProps<SyncBlockSetsCommand>) {
    super(props);

    Object.assign(this, props);
  }

  readonly sets!: SyncSet[];
}
