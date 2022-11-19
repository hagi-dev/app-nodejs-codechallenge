import { Injectable } from '@nestjs/common';

@Injectable()
export class AntiFraudService {
  getHello(): string {
    return 'Hello World! abti farude';
  }

  verificationFraud(data) {
    return data;
  }
}
