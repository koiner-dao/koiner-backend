import { ArgsType, Field } from '@nestjs/graphql';
import { Optional } from '@nestjs/common';
import { SortDirection } from '@appvise/domain';
import { SearchRequestArgs } from '@appvise/graphql';
import { TransactionsSortInput } from '@koiner/chain/api/graphql/transaction/dto/transactions.sort.input';
import { TransactionsSortFieldEnum } from '@koiner/chain/api/graphql/transaction/dto/transactions.sort-field.enum';
import { TransactionsFilter } from '@koiner/chain/api/graphql/transaction/dto/transactions.filter';

@ArgsType()
export class TransactionsRequest extends SearchRequestArgs {
  @Field(() => TransactionsFilter, { nullable: true })
  filter?: TransactionsFilter;

  @Optional()
  @Field(() => [TransactionsSortInput], {
    nullable: true,
    defaultValue: [
      {
        field: TransactionsSortFieldEnum.createdAt,
        direction: SortDirection.desc,
      } as TransactionsSortInput,
    ],
  })
  sort?: TransactionsSortInput[];
}