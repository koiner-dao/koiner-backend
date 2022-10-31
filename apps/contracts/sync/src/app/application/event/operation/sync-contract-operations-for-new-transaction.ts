import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UUID } from '@appvise/domain';
import { RawBlocksService } from '@koinos/jsonrpc';
import { TransactionCreatedMessage } from '@koiner/chain/events';
import { CallContractOperationJson } from 'koilib/lib/interface';
import {
  ContractQuery,
  CreateContractOperationCommand,
} from '@koiner/contracts/application';
import { Contract } from '@koiner/contracts/domain';
import { ContractStandardType } from '@koiner/contracts/standards';
import { ContractOperationWithTokenTypeCreatedMessage } from '@koiner/contracts/events';

@Injectable()
export class SyncContractOperationsForNewTransaction {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly rawBlocksService: RawBlocksService,
    private readonly amqpConnection: AmqpConnection
  ) {}

  @OnEvent(`${TransactionCreatedMessage.eventName}.operation_queue`, {
    async: false,
  })
  async handle(event: TransactionCreatedMessage): Promise<void> {
    const rawTransaction = await this.rawBlocksService.getTransaction(
      event.blockHeight,
      event.id
    );

    if (Array.isArray(rawTransaction.operations)) {
      for (
        let operationIndex = 0;
        operationIndex < rawTransaction.operations.length;
        operationIndex++
      ) {
        const operation = rawTransaction.operations[operationIndex];

        if (operation.call_contract) {
          const operationJson: CallContractOperationJson =
            operation.call_contract;

          const contractId = operationJson.contract_id;
          let contractStandardType = undefined;

          const contract = await this.queryBus.execute<ContractQuery, Contract>(
            new ContractQuery(contractId)
          );

          contractStandardType = contract.contractStandardType;

          const sharedProps = {
            blockHeight: event.blockHeight,
            contractId,
            transactionId: event.id,
            entryPoint: operationJson.entry_point,
            args: operationJson.args,
            contractStandardType,
            timestamp: event.timestamp,
          };

          // Don't save token events. Publish message so contract service can process it
          if (contractStandardType === ContractStandardType.token) {
            const message = new ContractOperationWithTokenTypeCreatedMessage({
              operationId: UUID.generate().value,
              ...sharedProps,
              publishedAt: Date.now(),
            });

            await this.amqpConnection.publish(
              'koiner.contracts.event',
              ContractOperationWithTokenTypeCreatedMessage.eventName,
              message.toString()
            );
          } else {
            await this.commandBus.execute(
              new CreateContractOperationCommand({
                id: UUID.generate().value,
                ...sharedProps,
              })
            );
          }
        }
      }
    }
  }
}
