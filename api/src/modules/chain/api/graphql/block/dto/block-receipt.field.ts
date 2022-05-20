import { Field, ObjectType } from '@nestjs/graphql';
import { BlockReceipt } from '@koiner/chain/domain';

@ObjectType('BlockReceipt')
export class BlockReceiptField {
  @Field()
  diskStorageUsed: number;

  @Field()
  networkBandwidthUsed: number;

  @Field()
  computeBandwidthUsed: number;

  @Field()
  eventCount: number;

  constructor(blockReceipt: BlockReceipt) {
    this.diskStorageUsed = blockReceipt.diskStorageUsed;
    this.networkBandwidthUsed = blockReceipt.networkBandwidthUsed;
    this.computeBandwidthUsed = blockReceipt.computeBandwidthUsed;
    this.eventCount = blockReceipt.eventCount;
  }
}
