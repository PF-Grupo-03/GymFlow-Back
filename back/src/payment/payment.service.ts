import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { MercadoPagoConfig, Payment, User } from 'mercadopago';
import { CreatePaymentDto } from './payment.dto';
import { PrismaService } from 'src/prisma.service';
import { MemberShipType, UserRole } from "@prisma/client";
import { addMonths } from 'date-fns';

@Injectable()
export class PaymentService {
  private mercadoPago: MercadoPagoConfig;

  constructor(private readonly prisma: PrismaService) {
    this.mercadoPago = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      const payment = new Payment(this.mercadoPago);
      const response = await payment.create({
        body: {
          description: createPaymentDto.description,
          transaction_amount: createPaymentDto.transactionAmount,
          payment_method_id: createPaymentDto.paymentMethodId,
          token: createPaymentDto.token,
          payer: { email: createPaymentDto.payerEmail },
          installments: 1,
        },
      });

      if (response.status !== 'approved') {
        throw new BadRequestException('El pago no fue aprobado');
      }

      // Buscar el usuario en la base de datos
      const user = await this.prisma.users.findUnique({
        where: { email: createPaymentDto.payerEmail },
        include: { member: true },
      });

      if (!user) {
        throw new BadRequestException('Usuario no encontrado.');
      }

      // Determinar el tipo de membresía en base al monto pagado
      let membershipType: MemberShipType;
      if (createPaymentDto.transactionAmount === 18000) {
        membershipType = MemberShipType.BASIC;
      } else if (createPaymentDto.transactionAmount === 30000) {
        membershipType = MemberShipType.PREMIUM;
      } else if (createPaymentDto.transactionAmount === 50000) {
        membershipType = MemberShipType.DIAMOND;
      } else {
        throw new BadRequestException('Monto de pago no válido para una membresía.');
      }

      let member;
      if (!user.member) {
        // Si el usuario no tiene una membresía, crear una nueva
        member = await this.prisma.member.create({
          data: {
            userId: user.id,
            memberShipType: membershipType,
            isActive: true,
            startDate: new Date(),
            endDate: addMonths(new Date(), 1), // Expira en 1 mes
          },
        });
      } else {
        // Si ya tiene una membresía, actualizarla
        member = await this.prisma.member.update({
          where: { id: user.member.id },
          data: {
            memberShipType: membershipType,
            isActive: true,
            startDate: new Date(),
            endDate: addMonths(new Date(), 1),
          },
        });
      }

      // Actualizar el rol del usuario en base a su membresía
      const newRole =
        membershipType === MemberShipType.BASIC
          ? UserRole.USER_BASIC
          : membershipType === MemberShipType.PREMIUM
          ? UserRole.USER_PREMIUM
          : UserRole.USER_DIAMOND;

      await this.prisma.users.update({
        where: { id: user.id },
        data: { role: newRole },
      });

      // Guardar el pago en la base de datos
      const newPayment = await this.prisma.payment.create({
        data: {
          memberId: member.id,
          amount: createPaymentDto.transactionAmount,
        },
      });

      return { message: 'Pago realizado y membresía actualizada correctamente.' };
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      throw new BadRequestException(`Error de pago: ${error.message || error.response?.message || 'No se pudo procesar el pago.'}`);
    }
  }
}











// export class PaymentService {
//   private mercadoPago: MercadoPagoConfig;

//   constructor(private readonly prisma: PrismaService) {
//     // Configurar MercadoPago con el Access Token
//     this.mercadoPago = new MercadoPagoConfig({
//       accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
//     });
//   }

//   async createPayment(createPaymentDto: CreatePaymentDto) {
//     try {
//       // Crear una instancia de pago
//       const payment = new Payment(this.mercadoPago);

//       // Procesar el pago con los datos recibidos
//       const response = await payment.create({
//         body: {
//           description: createPaymentDto.description,
//           transaction_amount: createPaymentDto.transactionAmount,
//           payment_method_id: createPaymentDto.paymentMethodId,
//           token: createPaymentDto.token, // Token generado desde el frontend
//           payer: {
//             email: createPaymentDto.payerEmail,
//           },
//         },
//       });
    
//       // Verificar si el pago fue exitoso
//     if (response.status !== 'approved') {
//       throw new BadRequestException('El pago no fue aprobado');
//     }

//      // Guardar el pago en la base de datos
//      const newPayment = await this.prisma.payment.create({
//        data: {
//          memberId: createPaymentDto.memberId,
//          amount: createPaymentDto.transactionAmount,
//          status: 'COMPLETED', // Actualizamos el estado del pago
//        },
//      });
 
//       // Actualizar la membresía del usuario
//       await this.prisma.member.update({
//         where: { id: createPaymentDto.memberId },
//         data: { isActive: true }, // Activar la membresía
//       });  

//         // Cambiar el rol del usuario si aplica
//         const member = await this.prisma.member.findUnique({
//           where: { id: createPaymentDto.memberId },
//           include: { user: true },
//         });
    
//         if (member) {
//           let newRole: UserRole = 'USER_MEMBER';
//           if (member.memberShipType === MemberShipType.BASIC) newRole = UserRole.USER_BASIC;
//           if (member.memberShipType === MemberShipType.PREMIUM) newRole = UserRole.USER_PREMIUM;
//           if (member.memberShipType === MemberShipType.DIAMOND) newRole = UserRole.USER_DIAMOND;
    
//           await this.prisma.users.update({
//             where: { id: member.userId },
//             data: { role: newRole },
//           });
//         }
    
//         return newPayment;

//     } catch (error) {
//       console.error('Error al procesar el pago:', error);

//       throw new BadRequestException(
//         error.message || 'No se pudo procesar el pago',
//       );
//     }
//   }
// }









