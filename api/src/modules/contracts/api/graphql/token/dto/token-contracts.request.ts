import { ArgsType, Field } from '@nestjs/graphql';
import { Optional } from '@nestjs/common';
import { SortDirection } from '@appvise/domain';
import { SearchRequestArgs } from '@appvise/graphql';
import { TokenContractsSortInput } from './token-contracts.sort.input';
import { TokenContractsSortFieldEnum } from './token-contracts.sort-field.enum';
import { TokenContractsFilter } from './token-contracts.filter';

@ArgsType()
export class TokenContractsRequest extends SearchRequestArgs {
  @Field(() => TokenContractsFilter, { nullable: true })
  filter?: TokenContractsFilter;

  @Optional()
  @Field(() => [TokenContractsSortInput], {
    nullable: true,
    defaultValue: [
      {
        field: TokenContractsSortFieldEnum.blockHeight,
        direction: SortDirection.desc,
      } as TokenContractsSortInput,
    ],
  })
  sort?: TokenContractsSortInput[];
}
