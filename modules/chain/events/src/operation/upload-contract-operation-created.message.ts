export class UploadContractOperationCreatedMessage {
  static routingKey = 'upload-contract-operation.created';

  constructor(props: Partial<UploadContractOperationCreatedMessage>) {
    Object.assign(this, props);
  }

  readonly contractId!: string;
  readonly bytecode!: string;
  readonly abi?: string;

  public toString(): string {
    return JSON.stringify(this);
  }
}
