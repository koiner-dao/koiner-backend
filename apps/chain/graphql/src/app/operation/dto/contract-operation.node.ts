import { ObjectType } from '@nestjs/graphql';
import { UUID } from '@appvise/domain';
import { BaseNode } from '@appvise/graphql';
import { Operation, OperationProps, OperationType } from '@koiner/chain/domain';
import { KoinosId } from '@koiner/domain';
import { OperationNode } from '../dto';

@ObjectType('ContractOperation')
export class ContractOperationNode extends BaseNode {
  // Used by UnionTypeResolver
  type: OperationType = OperationType.contractOperation;

  constructor(operation: OperationNode) {
    // Create domain object because we need it to call BaseNode constructor
    const id = new UUID(operation.id);

    const props: OperationProps = {
      blockHeight: operation.blockHeight,
      transactionId: new KoinosId(operation.transactionId),
      operationIndex: operation.index,
      type: operation.type,
      timestamp: operation.timestamp,
    };

    const _operation = new Operation({ id, props });

    super(_operation);
  }
}
