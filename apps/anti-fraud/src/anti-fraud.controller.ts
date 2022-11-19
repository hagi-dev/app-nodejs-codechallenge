import { Controller, Get, Inject, Body } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { ClientKafka } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';
import {
  EventPattern,
  MessagePattern,
  Payload,
  Ctx,
  KafkaContext,
} from '@nestjs/microservices';

@Controller()
export class AntiFraudController {
  constructor(
    private readonly antiFraudService: AntiFraudService,
    @Inject('TRANSACTION_SERVICE')
    private readonly clientTransaction: ClientKafka,
  ) {}

  @EventPattern('validate_transaction')
  handleValidateTransaction(data) {
    console.log('aaaaaa', data);
    //logica de validacion de fraude
    return this.clientTransaction.emit('update_transaction', data);
  }

  @MessagePattern('verify')
  verifyTransaction(@Body() value: number): Observable<number> {
    console.log('create transaction varify input', value);
    let resVerify = 0;
    value > 1000 ? (resVerify = 2) : (resVerify = 1);
    return of(resVerify);
  }
}
