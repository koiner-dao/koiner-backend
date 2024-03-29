import { BlockProducersLoader, BlockRewardsLoader } from './dataloader';
import {
  BlockProducerResolver,
  BlockProducersResolver,
  BlockProductionStatsResolver,
  BlockRewardProducerResolver,
  BlockRewardResolver,
  BlockRewardsBulkResolver,
  BlockRewardsResolver,
} from './query';
// import {
//   BlockRewardCreatedSubscription,
//   PublishBlockRewardCreatedToPubSub,
// } from './subscription';

export const BlockRewardGraphQLServices = [
  // DataLoader
  BlockProducersLoader,
  BlockRewardsLoader,

  // Queries
  BlockProducerResolver,
  BlockProducersResolver,
  BlockRewardResolver,
  BlockRewardsResolver,
  BlockRewardsBulkResolver,
  BlockProductionStatsResolver,

  // FieldResolvers
  BlockRewardProducerResolver,

  // Subscriptions
  // BlockRewardCreatedSubscription,
  // PublishBlockRewardCreatedToPubSub,
];

export * from './dataloader';
export * from './dto';
