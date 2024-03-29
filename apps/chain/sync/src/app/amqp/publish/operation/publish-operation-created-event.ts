import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { DomainEventHandler } from '@appvise/domain';
import { OperationCreated } from '@koiner/chain/domain';
import { OperationCreatedMessage } from '@koiner/chain/events';

export class PublishOperationCreatedEvent extends DomainEventHandler {
  constructor(private readonly amqpConnection: AmqpConnection) {
    super(OperationCreated);
  }

  async handle(event: OperationCreated): Promise<void> {
    const props = {
      operationId: event.aggregateId,
      blockHeight: event.blockHeight,
      transactionId: event.transactionId,
      operationIndex: event.operationIndex,
      type: event.type,
      timestamp: event.timestamp,
      operationData: event.operationData,
      publishedAt: Date.now(),
    };

    const message = new OperationCreatedMessage(props);

    await this.amqpConnection.publish(
      'koiner.chain.event',
      OperationCreatedMessage.eventName,
      message.toString()
    );
  }
}
