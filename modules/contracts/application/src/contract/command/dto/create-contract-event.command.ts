import { Command, CommandProps } from '@appvise/domain';
import { ContractStandardType } from '@koiner/contracts/domain';

export class CreateContractEventCommand extends Command {
  constructor(props: CommandProps<CreateContractEventCommand>) {
    super(props);

    Object.assign(this, props);
  }

  readonly id!: string;
  readonly parentId!: string;
  readonly parentType!: string;
  readonly sequence?: number;
  readonly contractId!: string;
  readonly contractStandardType?: ContractStandardType;
  readonly name!: string;
  readonly data!: string;
  readonly impacted?: string[];
}