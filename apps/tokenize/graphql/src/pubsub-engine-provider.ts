import { PubSubEngine } from '@koiner/nestjs-utils';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

export const PubSubEngineProvider = {
  provide: PubSubEngine,
  useFactory: async (amqpConnection: AmqpConnection) => {
    await amqpConnection.managedConnection.connect();

    return new PubSubEngine({
      connection: amqpConnection.managedConnection.connection,
      exchange: {
        name: 'koiner.tokenize.channel.graphql.subscriptions',
        type: 'topic',
        options: {
          durable: false,
          autoDelete: true,
        },
      },
      queue: {
        name: 'koiner.tokenize.queue.graphql.subscriptions',
        options: {
          exclusive: true,
          durable: true,
          autoDelete: true,
        },
        unbindOnDispose: false,
        deleteOnDispose: false,
      },
    });
  },
  inject: [AmqpConnection],
};
