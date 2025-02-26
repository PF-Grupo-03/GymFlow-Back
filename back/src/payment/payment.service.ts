// import { Injectable } from '@nestjs/common';
// import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { CreatePaymentDto } from './payment.dto';

@Injectable()
export class PaymentService {
  private mercadoPago: MercadoPagoConfig;

  constructor() {
    // Configurar MercadoPago con el Access Token
    this.mercadoPago = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      // Crear una instancia de pago
      const payment = new Payment(this.mercadoPago);

      // Procesar el pago con los datos recibidos
      const response = await payment.create({
        body: {
          description: createPaymentDto.description,
          transaction_amount: createPaymentDto.transactionAmount,
          payment_method_id: createPaymentDto.paymentMethodId,
          token: createPaymentDto.token, // Token generado desde el frontend
          payer: {
            email: createPaymentDto.payerEmail,
          },
        },
      });

      return response;
    } catch (error) {
      console.error('Error al procesar el pago:', error);

      throw new BadRequestException(
        error.message || 'No se pudo procesar el pago',
      );
    }
  }
}









// export class PaymentService {
//   private mercadoPago: MercadoPagoConfig;

//   constructor() {
//     // Configuramos Mercado Pago con el Access Token
//     this.mercadoPago = new MercadoPagoConfig({
//       accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
//     });
//   }

//   async createPayment(createPaymentDto: CreatePaymentDto) {
//     const payment = new Payment(this.mercadoPago);

//     const response = await payment.create({
//       body: {
//         description: createPaymentDto.description,
//         transaction_amount: createPaymentDto.transactionAmount,
//         payment_method_id: createPaymentDto.paymentMethodId,
//         payer: { email: createPaymentDto.payerEmail },
//       },
//     });

//     return response;
//   }
// }
