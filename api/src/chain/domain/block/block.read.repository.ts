import { ReadRepository, SelectionSet } from '@appvise/domain';
import { Block } from './block';

export abstract class BlockReadRepository extends ReadRepository<Block> {
  abstract findOneByHeight(
    height: number,
    selectionSet?: SelectionSet,
  ): Promise<Block | undefined>;

  abstract findOneByHeightOrThrow(
    height: number,
    selectionSet?: SelectionSet,
  ): Promise<Block>;
}
