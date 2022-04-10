import { TypeormRepositoryProvider } from '@appvise/typeorm';
import {
  Address,
  AddressReadRepository,
  AddressWriteRepository,
  Block,
  BlockReadRepository,
  BlockWriteRepository,
  Chain,
  ChainReadRepository,
  ChainWriteRepository,
  ContractOperation,
  ContractOperationReadRepository,
  ContractOperationWriteRepository,
  Operation,
  OperationReadRepository,
  SystemCallOperation,
  SystemCallOperationReadRepository,
  SystemCallOperationWriteRepository,
  SystemContractOperation,
  SystemContractOperationReadRepository,
  SystemContractOperationWriteRepository,
  Transaction,
  TransactionReadRepository,
  TransactionWriteRepository,
  UploadContractOperation,
  UploadContractOperationReadRepository,
  UploadContractOperationWriteRepository,
} from '@koiner/chain/domain';
import { BlockSchema, BlockSchemaFactory } from './block';
import {
  AddressSchema,
  AddressSchemaFactory,
  ChainSchema,
  ChainSchemaFactory,
  ContractOperationSchema,
  ContractOperationSchemaFactory,
  OperationSchema,
  OperationSchemaFactory,
  SystemCallOperationSchema,
  SystemCallOperationSchemaFactory,
  SystemContractOperationSchema,
  SystemContractOperationSchemaFactory,
  TransactionSchema,
  TransactionSchemaFactory,
  UploadContractOperationSchema,
  UploadContractOperationSchemaFactory,
} from '@koiner/chain/persistence/typeorm';
import { BlockReadTypeormRepository } from './block/block.read.typeorm.repository';

const addressSchemaFactory = new AddressSchemaFactory(Address, AddressSchema);
const blockSchemaFactory = new BlockSchemaFactory(Block, BlockSchema);
const chainSchemaFactory = new ChainSchemaFactory(Chain, ChainSchema);
const transactionSchemaFactory = new TransactionSchemaFactory(
  Transaction,
  TransactionSchema,
);
const operationSchemaFactory = new OperationSchemaFactory(
  Operation,
  OperationSchema,
);
const contractOperationSchemaFactory = new ContractOperationSchemaFactory(
  ContractOperation,
  ContractOperationSchema,
);
const systemCallOperationSchemaFactory = new SystemCallOperationSchemaFactory(
  SystemCallOperation,
  SystemCallOperationSchema,
);
const systemContractOperationSchemaFactory =
  new SystemContractOperationSchemaFactory(
    SystemContractOperation,
    SystemContractOperationSchema,
  );
const uploadContractOperationSchemaFactory =
  new UploadContractOperationSchemaFactory(
    UploadContractOperation,
    UploadContractOperationSchema,
  );

export default [
  // Block
  TypeormRepositoryProvider.provide(
    AddressReadRepository,
    AddressSchema,
    addressSchemaFactory,
  ),
  TypeormRepositoryProvider.provide(
    AddressWriteRepository,
    AddressSchema,
    addressSchemaFactory,
  ),

  // Block
  {
    provide: BlockReadRepository,
    useClass: BlockReadTypeormRepository,
  },
  TypeormRepositoryProvider.provide(
    BlockWriteRepository,
    BlockSchema,
    blockSchemaFactory,
  ),

  // Chain
  TypeormRepositoryProvider.provide(
    ChainReadRepository,
    ChainSchema,
    chainSchemaFactory,
  ),
  TypeormRepositoryProvider.provide(
    ChainWriteRepository,
    ChainSchema,
    chainSchemaFactory,
  ),

  // Transaction
  TypeormRepositoryProvider.provide(
    TransactionReadRepository,
    TransactionSchema,
    transactionSchemaFactory,
  ),
  TypeormRepositoryProvider.provide(
    TransactionWriteRepository,
    TransactionSchema,
    transactionSchemaFactory,
  ),

  //
  // Operations
  //

  // Operation
  TypeormRepositoryProvider.provide(
    OperationReadRepository,
    OperationSchema,
    operationSchemaFactory,
  ),

  // ContractOperation
  TypeormRepositoryProvider.provide(
    ContractOperationReadRepository,
    ContractOperationSchema,
    contractOperationSchemaFactory,
  ),
  TypeormRepositoryProvider.provide(
    ContractOperationWriteRepository,
    ContractOperationSchema,
    contractOperationSchemaFactory,
  ),

  // SystemCallOperation
  TypeormRepositoryProvider.provide(
    SystemCallOperationReadRepository,
    SystemCallOperationSchema,
    systemCallOperationSchemaFactory,
  ),
  TypeormRepositoryProvider.provide(
    SystemCallOperationWriteRepository,
    SystemCallOperationSchema,
    systemCallOperationSchemaFactory,
  ),

  // SystemContractOperation
  TypeormRepositoryProvider.provide(
    SystemContractOperationReadRepository,
    SystemContractOperationSchema,
    systemContractOperationSchemaFactory,
  ),
  TypeormRepositoryProvider.provide(
    SystemContractOperationWriteRepository,
    SystemContractOperationSchema,
    systemContractOperationSchemaFactory,
  ),

  // UploadContractOperation
  TypeormRepositoryProvider.provide(
    UploadContractOperationReadRepository,
    UploadContractOperationSchema,
    uploadContractOperationSchemaFactory,
  ),
  TypeormRepositoryProvider.provide(
    UploadContractOperationWriteRepository,
    UploadContractOperationSchema,
    uploadContractOperationSchemaFactory,
  ),
];
