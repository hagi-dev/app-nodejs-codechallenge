import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DataCreate, ResponseTransactionCreate } from './type/dataCreate';

@Injectable()
export class ApiGatewayService implements OnModuleInit {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    protected readonly gatewayService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gatewayService.subscribeToResponseOf('createTransactionDb');
    await this.gatewayService.connect();
  }

  createTransaction(data: DataCreate): Observable<ResponseTransactionCreate> {
    const pattern = 'createTransactionDb';
    const payload = JSON.stringify(data);
    return this.gatewayService.send<ResponseTransactionCreate>(
      pattern,
      payload,
    );
  }
}
