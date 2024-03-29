import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { DomainEventHandler } from '@appvise/domain';
import { UploadContractOperationCreated } from '@koiner/chain/domain';
import { UploadContractOperationCreatedMessage } from '@koiner/chain/events';

export class PublishUploadContractOperationCreatedEvent extends DomainEventHandler {
  constructor(private readonly amqpConnection: AmqpConnection) {
    super(UploadContractOperationCreated);
  }

  async handle(event: UploadContractOperationCreated): Promise<void> {
    const message = new UploadContractOperationCreatedMessage({
      contractId: event.contractId,
      bytecode: event.bytecode,
      abi: event.abi,
      timestamp: event.timestamp,
      publishedAt: Date.now(),
    });

    await this.amqpConnection.publish(
      'koiner.chain.event',
      UploadContractOperationCreatedMessage.eventName,
      message.toString()
    );
  }
}
