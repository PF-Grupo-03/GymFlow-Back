import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    console.log('📩 Webhook recibido:', req.body);

    try {
      await this.paymentService.processWebhook(req.body);
      res.sendStatus(200); // Mercado Pago espera un 200 OK para no reenviar el webhook
    } catch (error) {
      console.error('❌ Error procesando Webhook:', error);
      res.sendStatus(500);
    }
  }
}