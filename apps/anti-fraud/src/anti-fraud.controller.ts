import { Controller, Inject, Body } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { ClientKafka } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AntiFraudController {
  constructor(
    private readonly antiFraudService: AntiFraudService,
    @Inject('TRANSACTION_SERVICE')
    private readonly clientTransaction: ClientKafka,
  ) {}

  @MessagePattern('verify')
  verifyTransaction(@Body() value: number): Observable<number> {
    let resVerify = 0;
    value > 1000 ? (resVerify = 2) : (resVerify = 1);
    return of(resVerify);
  }
}
