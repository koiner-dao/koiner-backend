import { Field, InputType } from '@nestjs/graphql';
import { SortFieldInput } from '@appvise/graphql';
import { OperationsSortFieldEnum } from '.';

@InputType()
export class OperationsSortInput extends SortFieldInput {
  @Field(() => OperationsSortFieldEnum)
  field: OperationsSortFieldEnum;
}
