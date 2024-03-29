import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { EntityBaseSchema } from '@appvise/typeorm';

@Entity('network_block_reward')
export class BlockRewardSchema extends EntityBaseSchema {
  @Index()
  @Column({ length: 70 })
  readonly block_id!: string;

  @PrimaryColumn()
  @Column({ type: 'bigint' })
  readonly block_height!: number;

  @Index()
  @Column({ length: 35 })
  readonly producer_id!: string;

  @Index()
  @Column({ length: 20 })
  readonly value!: string;

  @Index()
  @Column({ length: 20 })
  readonly minted_value!: string;

  @Index()
  @Column({ length: 20 })
  readonly burned_value!: string;

  @Column({ length: 8 })
  readonly roi!: string;

  @Index()
  @Column({ type: 'bigint' })
  readonly timestamp!: number;
}
