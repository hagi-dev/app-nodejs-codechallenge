import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TransactionController } from './transaction.controller';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repository/transaction.repository';

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
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'toor',
    //   database: 'transaction',
    //   entities: [__dirname + '/**/.entity(. ts, .js)'],
    //   synchronize: true,
    // }),
    // TypeOrmModule.forFeature([Transaction, TypeTransaction]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: 'postgres',
      password: 'postgres',
      database: 'transaction',
      autoLoadEntities: true,
      entities: [Transaction],
      synchronize: true,
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
