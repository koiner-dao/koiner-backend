// TODO: Fix
// import { ContractOperationsLoader } from './dataloader';
import {
  ContractOperationDetailsResolver,
  ContractOperationResolver,
  ContractOperationsResolver,
} from './query';
// TODO: Fix
// import { ContractOperationTypeResolver } from './detail-resolver';

export const ContractOperationGraphQLServices = [
  // DataLoaders
  // TODO: Fix
  // ContractOperationsLoader,

  // Queries
  ContractOperationResolver,
  ContractOperationsResolver,
  ContractOperationDetailsResolver,

  // OperationType Resolvers
  // TODO: Fix
  // ContractOperationTypeResolver,
];

// TODO: Fix
// export * from './dataloader';
// TODO: Fix
// export * from './detail-resolver';
export * from './dto';