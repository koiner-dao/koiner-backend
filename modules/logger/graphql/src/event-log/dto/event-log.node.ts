import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseNode } from '@appvise/graphql';
import { EventLog } from '@koiner/logger/domain';
import { GraphQLBigInt } from 'graphql-scalars';

@ObjectType('EventLog')
export class EventLogNode extends BaseNode {
  @Field()
  eventName: string;

  @Field({ nullable: true })
  data?: string;

  @Field()
  itemId: string;

  @Field()
  itemType: string;

  @Field(() => GraphQLBigInt)
  timestamp: number;

  @Field(() => Int)
  count: number;

  constructor(entity: EventLog) {
    super(entity);

    this.eventName = entity.eventName;
    this.data = entity.data?.toString();
    this.itemId = entity.itemId;
    this.itemType = entity.itemType;
    this.timestamp = entity.timestamp;
    this.count = entity.count;
  }
}
