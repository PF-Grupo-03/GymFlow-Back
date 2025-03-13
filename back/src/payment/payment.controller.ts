import { Controller, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePreferenceDto } from "./payment.dto"
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}


  @ApiBearerAuth()
  @Post('preference')
  @UseGuards(AuthGuard)
  async createPreference(@Body() body: CreatePreferenceDto) {
    this.logger.log(`Creando preferencia para usuario: ${body.userEmail}`);
    return this.paymentService.createPreference(body.userId, body.userEmail, body.title, body.price);
  }


  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    this.logger.log(`📩 Webhook recibido: ${JSON.stringify(body)}`);
    
    // Verificar si el webhook tiene el tipo y el ID
    if (!body || !body.type || !body.data || !body.data.id) {
      this.logger.error('❌ Webhook recibido con formato incorrecto.');
      return { message: 'Formato de Webhook incorrecto' };
    }

    if (body.type === 'payment') {
      return this.paymentService.processPayment(body.data.id);
    }

    return { message: 'Webhook recibido, pero sin acción relevante.' };
  }
}

















// import { Controller, Post, Body, Res, Req, Get, Param, BadRequestException } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { PaymentService } from './payment.service';
// import { CreatePaymentDto } from './payment.dto';

// @Controller('payment')
// export class PaymentController {
//   constructor(private readonly paymentService: PaymentService) {}

//   @Post()
//   async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
//     return this.paymentService.createPayment(createPaymentDto);
//   }

//   @Post('webhook')
//   async handleWebhook(@Req() req: Request, @Res() res: Response) {
//     console.log('📩 Webhook recibido:', req.body);

//     try {
//       await this.paymentService.processWebhook(req.body);
//       res.sendStatus(200); // Mercado Pago espera un 200 OK para no reenviar el webhook
//     } catch (error) {
//       console.error('❌ Error procesando Webhook:', error);
//       res.sendStatus(500);
//     }
    
//   }

//   @Get(':paymentId') // Nuevo método HTTP GET
//   async getPaymentInfo(@Param('paymentId') paymentId: string) {
//     if (!paymentId) {
//       throw new BadRequestException('El ID del pago es obligatorio.');
//     }
//     return this.paymentService.getPaymentInfo(paymentId);
//   }
// }