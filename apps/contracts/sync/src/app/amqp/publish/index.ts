import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PublishAddressCreatedEvent } from './publish-address-created-event';
import { PublishAddressMarkedAsProducerEvent } from './publish-address-marked-as-producer-event';
import { PublishBlockRewardCreatedEvent } from './publish-block-reward-created-event';

export const ContractsAmqpPublishHandlers = [
  {
    provide: PublishAddressCreatedEvent,
    useFactory: (
      amqpConnection: AmqpConnection
    ): PublishAddressCreatedEvent => {
      const eventHandler = new PublishAddressCreatedEvent(amqpConnection);

      eventHandler.listen();

      return eventHandler;
    },
    inject: [AmqpConnection],
  },
  {
    provide: PublishAddressMarkedAsProducerEvent,
    useFactory: (
      amqpConnection: AmqpConnection
    ): PublishAddressMarkedAsProducerEvent => {
      const eventHandler = new PublishAddressMarkedAsProducerEvent(
        amqpConnection
      );

      eventHandler.listen();

      return eventHandler;
    },
    inject: [AmqpConnection],
  },
  {
    provide: PublishBlockRewardCreatedEvent,
    useFactory: (
      amqpConnection: AmqpConnection
    ): PublishBlockRewardCreatedEvent => {
      const eventHandler = new PublishBlockRewardCreatedEvent(amqpConnection);

      eventHandler.listen();

      return eventHandler;
    },
    inject: [AmqpConnection],
  },
];
