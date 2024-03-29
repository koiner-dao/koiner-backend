import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Transaction, TransactionReadRepository } from '@koiner/chain/domain';
import { TransactionQuery } from '.';

@QueryHandler(TransactionQuery)
export class TransactionHandler implements IQueryHandler<TransactionQuery> {
  constructor(private readonly readRepository: TransactionReadRepository) {}

  async execute(query: TransactionQuery): Promise<Transaction> {
    return this.readRepository.findOneByIdOrThrow(query.id, query.selectionSet);
  }
}
