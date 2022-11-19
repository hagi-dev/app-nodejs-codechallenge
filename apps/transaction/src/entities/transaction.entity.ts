import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Guid } from 'guid-typescript';
import { status } from '../type/typeTransaction';
import internal from 'stream';

@Entity()
export class Transaction {
  @PrimaryColumn({
    name: 'transactionExternalId',
    default: () => Guid.create(),
  })
  transactionExternalId: string;

  @Column({
    name: 'accountExternalIdDebit',
  })
  accountExternalIdDebit: string;

  @Column({
    name: 'tranferTypeId',
  })
  tranferTypeId: number;

  @Column({
    name: 'accountExternalIdCredit',
  })
  accountExternalIdCredit: string;

  @Column({
    name: 'value',
    type: 'int',
  })
  value: number;

  @Column({
    name: 'transactionStatus',
    default: () => status.PENDING,
  })
  transactionStatus: number;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
