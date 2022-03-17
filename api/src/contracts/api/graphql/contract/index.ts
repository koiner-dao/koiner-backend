import { ContractResolver } from './query/node-queries';
import { ContractsResolver } from './query/contracts.resolver';
import { ContractOperationDetailsResolver } from './query/contract-operation-details.resolver';

export default [
  // Queries
  ContractResolver,
  ContractsResolver,
  ContractOperationDetailsResolver,
];

// Must be exported for the enum to be registered in GraphQL schema
export * from './dto/contract-standard-type.enum';