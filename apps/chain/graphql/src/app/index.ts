import { AddressGraphQLServices } from './address';
import { BlockGraphQLServices } from './block';
import { ChainGraphQLServices } from './chain';
import { EventGraphQLServices } from './event';
import { OperationGraphQLServices } from './operation';
import { TransactionGraphQLServices } from './transaction';

export * from './address';
export * from './block';
export * from './chain';
export * from './event';
export * from './operation';
export * from './transaction';

export const ChainModuleGraphQLServices = [
  ...AddressGraphQLServices,
  ...BlockGraphQLServices,
  ...ChainGraphQLServices,
  ...EventGraphQLServices,
  ...OperationGraphQLServices,
  ...TransactionGraphQLServices,
];
