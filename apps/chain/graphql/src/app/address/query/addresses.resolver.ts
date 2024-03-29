import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { SearchResponse } from '@appvise/domain';
import { SelectionSet, ConnectionFactory } from '@appvise/graphql';
import { Address } from '@koiner/chain/domain';
import { AddressesQuery } from '@koiner/chain/application';
import { AddressNode, AddressesConnection, AddressesRequest } from '../dto';

@Resolver(() => AddressNode)
export class AddressesResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => AddressesConnection, { name: 'addresses' })
  async execute(
    @Args() request: AddressesRequest,
    @SelectionSet() selectionSet
  ): Promise<AddressesConnection> {
    const searchResponse = await this.queryBus.execute<
      AddressesQuery,
      SearchResponse<Address>
    >(new AddressesQuery(request, selectionSet, ['id']));

    return ConnectionFactory.fromSearchResponse(
      AddressesConnection,
      AddressNode,
      searchResponse,
      selectionSet
    );
  }
}
