import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import {
  ContractStandardService,
  ContractStandardType,
} from '@koiner/contracts/standards';
import { ContractEventWithTokenTypeCreatedMessage } from '@koiner/contracts/events';
import { CreateTokenEventCommand } from '../..';
import { EventParentType } from '@koiner/domain';

@Injectable()
export class CreateTokenEventOnContractEventCreated {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly contractStandardService: ContractStandardService
  ) {}

  @OnEvent(ContractEventWithTokenTypeCreatedMessage.eventName, {
    async: false,
  })
  async handle(event: ContractEventWithTokenTypeCreatedMessage): Promise<void> {
    // Ignore invalid events
    if (!event.data) {
      return;
    }

    try {
      let entryPoint: any;

      // TODO: Find way to retrieve using contract standards
      if (event.name.includes('transfer')) {
        entryPoint = 0x27f576ca;
      } else if (event.name.includes('mint')) {
        entryPoint = 0xdc6f17bb;
      } else if (event.name.includes('burn')) {
        entryPoint = 0x859facc5;
      }

      if (entryPoint) {
        const decodedEvent = await this.contractStandardService.decodeOperation(
          event.contractId,
          entryPoint,
          event.data,
          ContractStandardType.token
        );

        await this.commandBus.execute(
          new CreateTokenEventCommand({
            id: event.eventId,
            blockHeight: event.blockHeight,
            parentId: event.parentId,
            parentType: event.parentType as EventParentType.block,
            sequence: event.sequence,
            contractId: event.contractId,
            name: decodedEvent.name,
            from: <string>decodedEvent.data.from,
            to: <string>decodedEvent.data.to,
            value: parseInt(<string>decodedEvent.data.value),
            timestamp: event.timestamp,
          })
        );
      }
    } catch (error) {
      console.error('Could not decode TokenEvent args', error);
      console.log(event.toString());
      // Fail silently and ignore event
    }
  }
}
