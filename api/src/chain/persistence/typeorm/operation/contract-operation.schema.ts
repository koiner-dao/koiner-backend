import { EntityBaseSchema } from '@appvise/typeorm';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { OperationSchema } from '@koiner/chain/persistence/typeorm';

@Entity('contract_operation')
export class ContractOperationSchema extends EntityBaseSchema {
  @PrimaryColumn()
  @Column({ length: 34 })
  readonly id: string;

  // Add foreign key without the need to always use the relation
  @OneToOne(() => OperationSchema, { nullable: false, persistence: false })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  private _operation_id_fg: never;

  @Column({ length: 34 })
  readonly contract_id: string;

  @Column({ type: 'bigint' })
  readonly entry_point: number;

  @Column({ type: 'bytea' })
  readonly args: string;
}