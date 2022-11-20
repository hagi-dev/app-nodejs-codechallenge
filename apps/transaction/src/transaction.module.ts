import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TransactionController } from './transaction.controller';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repository/transaction.repository';
import * as dotenv from 'dotenv';

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT, DB_SYNC } =
  process.env;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTI-FRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'anti-fraud_group',
          },
        },
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: parseInt(DB_PORT),
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      autoLoadEntities: true,
      entities: [Transaction],
      synchronize: !!DB_SYNC,
    }),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TypeOrmModule],
})
export class TransactionModule {
  constructor(private dataSource: DataSource) {}
}
