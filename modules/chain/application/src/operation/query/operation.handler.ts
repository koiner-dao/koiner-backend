import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Operation, OperationReadRepository } from '@koiner/chain/domain';
import { OperationQuery } from '.';

@QueryHandler(OperationQuery)
export class OperationHandler implements IQueryHandler<OperationQuery> {
  constructor(private readonly readRepository: OperationReadRepository) {}

  async execute(query: OperationQuery): Promise<Operation> {
    return this.readRepository.findOneByIdOrThrow(query.id, query.selectionSet);
  }
}
