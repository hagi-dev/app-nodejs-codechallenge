import { Injectable, Body } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class AntiFraudService {
  getHello(): string {
    return 'Hello World! abti farude';
  }

  verifyImport(@Body() value: number): Observable<number> {
    let resVerify = 0;
    value > 1000 ? (resVerify = 2) : (resVerify = 1);
    return of(resVerify);
  }
}
