import { ReadRepository, SelectionSet, WriteRepository } from '@appvise/domain';
import { TokenBalance, TokenContract, TokenOperation } from '..';

export abstract class TokenBalanceReadRepository extends ReadRepository<TokenBalance> {}
export abstract class TokenBalanceWriteRepository extends WriteRepository<TokenBalance> {
  abstract findOne(
    addressId: string,
    contractId: string,
    selectionSet?: SelectionSet,
  ): Promise<TokenBalance | undefined>;
}
export abstract class TokenContractReadRepository extends ReadRepository<TokenContract> {}
export abstract class TokenContractWriteRepository extends WriteRepository<TokenContract> {}
export abstract class TokenOperationReadRepository extends ReadRepository<TokenOperation> {}
export abstract class TokenOperationWriteRepository extends WriteRepository<TokenOperation> {}
