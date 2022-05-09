import { DomainEventHandler } from '@appvise/domain';
import { Operation, OperationCreated } from '@koiner/chain/domain';
import { PubSubEngine } from '@koiner/pubsub-engine';
import { QueryBus } from '@nestjs/cqrs';
import { OperationQuery } from '@koiner/chain/application/operation/query';
import { OperationNode } from '@koiner/chain/api/graphql/operation/dto/operation.node';

export class PublishOperationCreatedEvent extends DomainEventHandler {
  constructor(
    private readonly pubSub: PubSubEngine,
    private readonly queryBus: QueryBus,
  ) {
    super(OperationCreated);
  }

  async handle(event: OperationCreated): Promise<void> {
    const operation = await this.queryBus.execute<OperationQuery, Operation>(
      new OperationQuery(event.aggregateId),
    );

    await this.pubSub.publish('operationCreated', {
      operationCreated: new OperationNode(operation),
    });
  }
}
