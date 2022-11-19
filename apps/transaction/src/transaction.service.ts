import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { from, Observable, of } from 'rxjs';
import { Transaction } from './entities/transaction.entity';
import { ResponseTransactionCreate } from './type/reponseType';
import { TypeTransferChange, status } from './type/typeTransaction';
import { TransactionRepository } from './repository/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ANTI-FRAUD_SERVICE')
    protected readonly atifraudService: ClientKafka,
    private transactionRepository: TransactionRepository,
  ) {}

  async onModuleInit() {
    this.atifraudService.subscribeToResponseOf('verify');
    await this.atifraudService.connect();
  }

  async createTransaction(
    data: CreateTransactionDto,
  ): Promise<Observable<ResponseTransactionCreate[]>> {
    console.log('create transaction', data);
    const transaction: Transaction = await this.transactionRepository.create(
      data,
    );
    console.log('create transaction ouput', transaction);
    const tranferTypeId = data.tranferTypeId;
    const pattern = 'verify';
    const payload = JSON.stringify(data.value);
    await this.atifraudService
      .send<number>(pattern, payload)
      .subscribe((res) => {
        transaction.transactionStatus = res;
        console.log('create transaction varify', res);
        this.update(transaction.transactionExternalId, transaction);
      });
    //TypeTransactionRepository
    const dataResponse: ResponseTransactionCreate[] = [
      {
        transactionExternalId: transaction.transactionExternalId,
        transactionType: {
          name: tranferTypeId == 1 ? 'Debit' : 'Credit',
        },
        transactionStatus: {
          name: transaction.transactionStatus === 1 ? 'Approved' : 'Rejected',
        },
        value: transaction.value,
        createdAt: transaction.createdAt,
      },
    ];
    return from([dataResponse]);
  }

  async update(transactionExternalId: string, data: CreateTransactionDto) {
    await this.transactionRepository.update(transactionExternalId, data);
  }

  findAll() {
    return `This action returns all transaction`;
  }

  hello() {
    return 'jako nepe jala tripas';
  }
}
