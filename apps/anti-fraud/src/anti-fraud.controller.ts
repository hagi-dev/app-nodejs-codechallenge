import { Controller, Inject, Body } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { ClientKafka } from '@nestjs/microservices';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AntiFraudController {
  constructor(
    private readonly antiFraudService: AntiFraudService,
    @Inject('TRANSACTION_SERVICE')
    private readonly clientTransaction: ClientKafka,
  ) {}

  @MessagePattern('verify')
  verifyTransaction(@Body() value: number) {
    return this.antiFraudService.verifyImport(value);
  }
}
