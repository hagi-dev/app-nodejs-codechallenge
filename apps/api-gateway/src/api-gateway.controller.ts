// import { Controller, Get, Inject, Param, OnModuleInit } from '@nestjs/common';
// import { ApiGatewayService } from './api-gateway.service';
// import { ClientKafka } from '@nestjs/microservices';
// import { Observable } from 'rxjs';
// import { toArray } from 'rxjs/operators';
// //mport { CreateTransactionDto } from '../../transaction/src/dto/create-transaction.dto';

// @Controller()
// export class ApiGatewayController implements OnModuleInit {
//   constructor(
//     private readonly apiGatewayService: ApiGatewayService,
//     @Inject('TRANSACTION_SERVICE')
//     private readonly gatewayTransaction: ClientKafka,
//   ) {}

//   async onModuleInit() {
//     this.gatewayTransaction.subscribeToResponseOf('count');
//     await this.gatewayTransaction.connect();
//   }

//   @Get()
//   getHello(): string {
//     return this.apiGatewayService.getHello();
//   }

//   // @Post()
//   // async producer(@Body() body):Observable<number> {
//   //   return await this.gatewayTransaction
//   //     .send({
//   //       topic: 'create_transaction',
//   //       messages: [{ key: 'pagamentos', value: JSON.stringify(body) }],
//   //     })
//   //     .pipe(toArray());
//   // }
//   @Get('/count/:max')
//   count(@Param('max') max: string): Observable<number[]> {
//     return this.gatewayTransaction
//       .send<number>('count', { max: Number(max) })
//       .pipe(toArray());
//   }
// }
import {
  Controller,
  Post,
  Inject,
  OnModuleInit,
  Body,
  Get,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable, of, from, toArray } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';
import { DataCreate, ResponseTransactionCreate } from './type/dataCreate';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get('')
  hellor(): string {
    return 'hello';
  }

  // @Post('/transaction/create')
  // createTransaction(
  //   @Body() data: DataCreate,
  // ): Observable<ResponseTransactionCreate> {
  //   try {
  //     console.log('imput general', data);
  //     return this.gatewayService
  //       .send<ResponseTransactionCreate>('create', {
  //         data: data,
  //       })
  //       .pipe();
  //   } catch (error) {
  //     console.error('error da', error.message);
  //   }
  // }

  @Get('/test')
  Numbers() {
    return this.apiGatewayService.accumulate();
  }

  @Post('/transaction')
  createTransaction(@Body() data: DataCreate) {
    return this.apiGatewayService.createTransaction(data);
  }
}
