import { Controller, Post, Body } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { DataCreate } from './type/dataCreate';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('/transaction')
  createTransaction(@Body() data: DataCreate) {
    try {
      return this.apiGatewayService.createTransaction(data);
    } catch (error) {
      console.error(error);
    }
  }
}
