import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SyncService } from './sync.service';
import { SyncBlockSetsCommand, SyncSet } from './application';
import { koinos } from '../config';
import { UndoBlocksCommand } from '@koiner/chain/application';

@Controller()
export class ManualSyncController {
  constructor(
    private readonly syncService: SyncService,
    private readonly commandBus: CommandBus
  ) {}

  @Get('/sync')
  async sync(
    @Query('secret') secret: string,
    @Query('batchSize') batchSize?: number
  ): Promise<void> {
    if (secret && koinos.syncSecret && secret === koinos.syncSecret) {
      await this.syncService.sync(batchSize);
    } else {
      throw new ForbiddenException();
    }
  }

  @Post('/sync-set')
  async syncSet(
    @Query('secret') secret: string,
    @Body() input: { sets: SyncSet[] }
  ): Promise<void> {
    if (secret && koinos.syncSecret && secret === koinos.syncSecret) {
      await this.commandBus.execute(
        new SyncBlockSetsCommand({
          sets: input.sets,
        })
      );
    } else {
      throw new ForbiddenException();
    }
  }

  @Post('/undo')
  async undo(
    @Query('secret') secret: string,
    @Body() input: { heights: number[] }
  ): Promise<void> {
    if (secret && koinos.syncSecret && secret === koinos.syncSecret) {
      await this.commandBus.execute(
        new UndoBlocksCommand({
          blockHeights: input.heights,
        })
      );
    } else {
      throw new ForbiddenException();
    }
  }
}
