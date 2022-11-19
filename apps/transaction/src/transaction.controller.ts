// import { Controller, Get, Post, Body, Logger, Inject } from '@nestjs/common';
// import { TransactionService } from './transaction.service';
// import { CreateTransactionDto } from './dto/create-transaction.dto';
// import {
//   ClientKafka,
//   EventPattern,
//   MessagePattern,
// } from '@nestjs/microservices';
// import { from, Observable } from 'rxjs';

// @Controller()
// export class TransactionController {
//   constructor(
//     private readonly transactionService: TransactionService,
//     @Inject('ANTI-FRAUD_SERVICE') private readonly clientFraud: ClientKafka,
//   ) {}

//   @EventPattern('create_transaction')
//   handleValidateTransaction(data): Observable<number> {
//     //logica para guarda la transaction en esta pending
//     console.log('rrrtt', data);
//     this.clientFraud.emit('validate_transaction', data);
//     const array: number[] = [1, 2, 3];
//     return from(array);
//   }

//   @EventPattern('update_transaction')
//   async handleUpdateTransaction(data) {
//     console.log('data update transaction:', data);
//     //logica de actualizar el register de trasaction
//     return;
//   }
//   @MessagePattern('count')
//   count(message: { value: { max: number } }): Observable<number> {
//     console.log('ggggg', message);
//     const numbers = [];

//     for (let i = 1; i <= message.value.max; i++) {
//       numbers.push(`i-${i}`);
//     }

//     return from(numbers);
//   }
//   @EventPattern('count.reply')
//   logReply(message: { value: number }): void {
//     console.log('ggggg2222', message);
//     Logger.log(message.value);
//   }
// }

import { Controller, Logger, Inject } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  ClientKafka,
} from '@nestjs/microservices';
import { from, Observable, of } from 'rxjs';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ResponseTransactionCreate } from './type/reponseType';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
  private readonly transactionService: TransactionService;

  @EventPattern('create.reply')
  logReply(data: ResponseTransactionCreate[]): void {
    Logger.log(data);
  }

  @MessagePattern('sum')
  accumulate(data: number[]): Observable<number[]> {
    return from([data]);
  }

  @MessagePattern('createTransactionDb')
  createTransactionDb(data: CreateTransactionDto) {
    return this.transactionService.createTransaction(data);
  }
}
