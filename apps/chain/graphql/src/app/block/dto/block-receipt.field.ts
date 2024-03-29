import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlockReceipt } from '@koiner/chain/domain';

@ObjectType('BlockReceipt')
export class BlockReceiptField {
  @Field(() => String)
  diskStorageUsed: string;

  @Field(() => String)
  networkBandwidthUsed: string;

  @Field(() => String)
  computeBandwidthUsed: string;

  @Field(() => Int)
  eventCount: number;

  constructor(blockReceipt: BlockReceipt) {
    this.diskStorageUsed = blockReceipt.diskStorageUsed.toString();
    this.networkBandwidthUsed = blockReceipt.networkBandwidthUsed.toString();
    this.computeBandwidthUsed = blockReceipt.computeBandwidthUsed.toString();
    this.eventCount = blockReceipt.eventCount;
  }
}
