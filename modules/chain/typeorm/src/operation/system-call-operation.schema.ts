import { EntityBaseSchema } from '@appvise/typeorm';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { OperationSchema } from '..';

@Entity('chain_system_call_operation')
export class SystemCallOperationSchema extends EntityBaseSchema {
  @PrimaryColumn()
  @Column({ length: 35 })
  override readonly id!: string;

  // Add foreign key without the need to always use the relation
  @OneToOne(() => OperationSchema, { nullable: false, persistence: false })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  private _operation_id_fg!: never;

  @Index()
  @Column({ length: 35 })
  readonly contract_id!: string;

  @Index()
  @Column({ type: 'bigint' })
  readonly call_id!: number;
}
