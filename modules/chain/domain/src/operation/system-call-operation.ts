import { AggregateRoot, UUID } from '@appvise/domain';
import { KoinosAddressId, KoinosId } from '@koiner/domain';
import {
  CreateSystemCallOperationProps,
  SystemCallOperationCreated,
  SystemCallOperationProps,
} from '.';

export class SystemCallOperation extends AggregateRoot<SystemCallOperationProps> {
  protected readonly _id!: KoinosId;

  static create(
    create: CreateSystemCallOperationProps,
    id: UUID,
    timestamp: number // Only used for dispatching event
  ): SystemCallOperation {
    const props: SystemCallOperationProps = {
      ...create,
    };

    const systemCallOperation = new SystemCallOperation({ id, props });

    systemCallOperation.addEvent(
      new SystemCallOperationCreated({
        aggregateId: id.value,
        contractId: props.contractId.value,
        callId: props.callId,
        timestamp,
      })
    );

    return systemCallOperation;
  }

  get contractId(): KoinosAddressId {
    return this.props.contractId;
  }

  get callId(): number {
    return this.props.callId;
  }

  validate(): void {
    // TODO: Add validations
  }
}
