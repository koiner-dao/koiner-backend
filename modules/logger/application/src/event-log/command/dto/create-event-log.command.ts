import { Command, CommandProps } from '@appvise/domain';

export class CreateEventLogCommand extends Command {
  constructor(props: CommandProps<CreateEventLogCommand>) {
    super(props);

    Object.assign(this, props);
  }

  readonly eventName!: string;
  readonly data?: Record<string, any>;
  readonly itemId!: string;
  readonly itemType!: string;
  readonly timestamp?: number;
  readonly id?: string;
}
