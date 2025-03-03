import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MercadoPagoService } from './Mp/mercadoPago';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, MercadoPagoService, UsersService],
})
export class PaymentModule {}
