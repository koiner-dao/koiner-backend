import { Injectable } from '@nestjs/common';
import {
  BlockJson,
  OperationJson,
  TransactionJson,
} from 'koilib/lib/interface';
import { Provider } from 'koilib';

export interface RawBlock {
  block_id: string;
  block_height: string;
  block: BlockJson;
  receipt: {
    [x: string]: any;
  };
}

@Injectable()
export class RawBlocksService {
  private blocksInMemory: Record<string, RawBlock> = {};

  constructor(private readonly provider: Provider) {}

  async getBlocks(height: number, amount = 1): Promise<RawBlock[]> {
    const blocks = await this._koilibGetBlocks(height, amount);

    for (let i = 0; i < blocks.length; i++) {
      // Save to memory
      this.blocksInMemory[height.toString()] = blocks[i];
    }

    return blocks;
  }

  async getBlock(height: number): Promise<RawBlock> {
    // Only fetch from memory when 1 block is retrieved
    // We only use memory for event listeners that process block data
    if (this.blocksInMemory[height]) {
      return this.blocksInMemory[height];
    }

    const blocks = await this._koilibGetBlocks(height, 1);

    this.blocksInMemory[height.toString()] = blocks[0];

    return blocks[0];
  }

  async getTransaction(
    height: number,
    transactionId: string,
  ): Promise<TransactionJson> {
    const rawBlock = await this.getBlock(height);

    return rawBlock.block.transactions.find((tx) => tx.id === transactionId);
  }

  async getOperation(
    height: number,
    transactionId: string,
    operationIndex: number,
  ): Promise<OperationJson> {
    const transaction = await this.getTransaction(height, transactionId);

    return transaction.operations[operationIndex];
  }

  /**
   * Include getBlocks from koilib here because there is not a way yet
   * to retrieve the blocks with the receipts.
   *
   * Function to get consecutive blocks in descending order
   * @param height - Starting block height
   * @param numBlocks - Number of blocks to fetch
   * @param idRef - Block ID reference to speed up searching blocks.
   * This ID must be from a greater block height. By default it
   * gets the ID from the block head.
   */
  private async _koilibGetBlocks(
    height: number,
    numBlocks = 1,
    idRef?: string,
  ): Promise<RawBlock[]> {
    let blockIdRef = idRef;
    if (!blockIdRef) {
      const head = await this.provider.getHeadInfo();
      blockIdRef = head.head_topology.id;
    }
    return (
      await this.provider.call<{
        block_items: {
          block_id: string;
          block_height: string;
          block: BlockJson;
          receipt: {
            [x: string]: unknown;
          };
        }[];
      }>('block_store.get_blocks_by_height', {
        head_block_id: blockIdRef,
        ancestor_start_height: height,
        num_blocks: numBlocks,
        return_block: true,
        return_receipt: true,
      })
    ).block_items;
  }
}
