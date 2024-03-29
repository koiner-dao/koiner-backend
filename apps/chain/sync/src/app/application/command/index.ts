import { SyncBlockHandler } from './sync-block.handler';
import { SyncBlocksHandler } from './sync-blocks.handler';
import { SyncBlockSetsHandler } from './sync-block-sets.handler';

export { SyncBlockCommand } from './dto/sync-block.command';
export { SyncBlocksCommand } from './dto/sync-blocks.command';
export { SyncBlockSetsCommand } from './dto/sync-block-sets.command';
export { SyncSet } from './dto/sync-block-set.dto';

export const ChainSyncCommandHandlers = [
  SyncBlockHandler,
  SyncBlocksHandler,
  SyncBlockSetsHandler,
];
