import { Field, ObjectType } from '@nestjs/graphql';
import { BaseNode } from '@appvise/graphql';
import { TokenOperation, ContractStandardType } from '@koiner/contracts/domain';

@ObjectType('TokenOperation')
export class TokenOperationNode extends BaseNode {
  @Field()
  transactionId: string;

  @Field()
  contractId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  from?: string;

  @Field({ nullable: true })
  to?: string;

  @Field()
  value: number;

  // Used by UnionTypeResolver
  contractStandardType: ContractStandardType = ContractStandardType.token;

  constructor(tokenOperation: TokenOperation) {
    super(tokenOperation);

    this.transactionId = tokenOperation.transactionId.value;
    this.contractId = tokenOperation.contractId.value;
    this.name = tokenOperation.name;
    this.from = tokenOperation.from ? tokenOperation.from.value : undefined;
    this.to = tokenOperation.to ? tokenOperation.to.value : undefined;
    this.value = tokenOperation.value;
  }
}
