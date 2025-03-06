import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { MercadoPagoService } from './Mp/mercadoPago';
import { PrismaService } from 'src/prisma.service';
import { MemberShipType, UserRole } from '@prisma/client';
import { addMonths } from 'date-fns';
import axios from 'axios';
import { ProcessPaymentDto } from './payment.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  async createPreference(userId: string, userEmail: string, title: string, price: number) {
    try {
      this.logger.log(`Creando preferencia para usuario: ${userEmail} con plan: ${title}`);


      const user = await this.prisma.users.findUnique({
        where: { id: userId, email: userEmail },
      });
      
      if (!user) {
        throw new BadRequestException('El usuario no existe en la base de datos.');
      }

      const response = await this.mercadoPagoService.createPreference(
        { title, price },
        userId,
        userEmail,
      );

      if (!response.id) {
        throw new BadRequestException('No se pudo generar la preferencia de pago');
      }

      return {
        preferenceId: response.id,
        initPoint: response.init_point,
        message: 'Preferencia de pago creada con éxito.',
      };
    } catch (error) {
      this.logger.error('Error al crear la preferencia de pago:', error);
      throw new BadRequestException('Error al crear la preferencia de pago.');
    }
  }


  async processPayment(paymentData: ProcessPaymentDto) {
    try {
      this.logger.log(`Procesando pago con ID: ${paymentData.paymentId}`);

      if (paymentData.status !== 'approved') {
        this.logger.warn(`Pago no aprobado: ${paymentData.status}`);
        throw new BadRequestException('El pago no ha sido aprobado aún.');
      }

      const user = await this.prisma.users.findUnique({
        where: { email: paymentData.userEmail },
        include: { member: true },
      });

      if (!user) {
        this.logger.error('Usuario no encontrado para este pago.');
        throw new BadRequestException('Usuario no encontrado.');
      }

      // Verificar si el usuario tiene una membresía activa y no vencida
      if (user.member && user.member.isActive && new Date(user.member.endDate) > new Date()) {
      throw new BadRequestException('Ya tienes una membresía activa. No puedes pagar otra hasta que expire.');
      }

      let membershipType: MemberShipType;
      if (paymentData.amount === 18000) {
        membershipType = MemberShipType.BASIC;
      } else if (paymentData.amount === 30000) {
        membershipType = MemberShipType.PREMIUM;
      } else if (paymentData.amount === 50000) {
        membershipType = MemberShipType.DIAMOND;
      } else {
        throw new BadRequestException('Monto de pago no válido para una membresía.');
      }

      let member;
      if (!user.member) {
        member = await this.prisma.member.create({
          data: {
            userId: user.id,
            memberShipType: membershipType,
            isActive: true,
            startDate: new Date(),
            endDate: addMonths(new Date(), 1),
          },
        });
      } else {
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

      const newRole = membershipType === MemberShipType.BASIC
        ? UserRole.USER_BASIC
        : membershipType === MemberShipType.PREMIUM
        ? UserRole.USER_PREMIUM
        : UserRole.USER_DIAMOND;

      await this.prisma.users.update({
        where: { id: user.id },
        data: { role: newRole },
      });

      await this.prisma.payment.create({
        data: {
          memberId: member.id,
          amount: paymentData.amount,
        },
      });

      this.logger.log('Pago registrado y membresía actualizada con éxito.');
      return { message: 'Pago procesado correctamente.' };
    } catch (error) {
      this.logger.error('Error procesando el pago:', error);
      throw new BadRequestException('Error al procesar el pago.');
    }
  }
}  







  // async processPayment(paymentId: string) {
  //   try {
  //     this.logger.log(`Procesando pago con ID: ${paymentId}`);

  //     const paymentInfo = await this.getPaymentInfo(paymentId);
  //     if (!paymentInfo || paymentInfo.status !== 'approved') {
  //       this.logger.warn(`Pago no aprobado: ${paymentInfo?.status}`);
  //       throw new BadRequestException('El pago no ha sido aprobado aún.');
  //     }

  //     const user = await this.prisma.users.findUnique({
  //       where: { email: paymentInfo.payer.email },
  //       include: { member: true },
  //     });

  //     if (!user) {
  //       this.logger.error('Usuario no encontrado para este pago.');
  //       throw new BadRequestException('Usuario no encontrado.');
  //     }

  //     let membershipType: MemberShipType;
  //     if (paymentInfo.transaction_amount === 18000) {
  //       membershipType = MemberShipType.BASIC;
  //     } else if (paymentInfo.transaction_amount === 30000) {
  //       membershipType = MemberShipType.PREMIUM;
  //     } else if (paymentInfo.transaction_amount === 50000) {
  //       membershipType = MemberShipType.DIAMOND;
  //     } else {
  //       throw new BadRequestException('Monto de pago no válido para una membresía.');
  //     }

  //     let member;
  //     if (!user.member) {
  //       member = await this.prisma.member.create({
  //         data: {
  //           userId: user.id,
  //           memberShipType: membershipType,
  //           isActive: true,
  //           startDate: new Date(),
  //           endDate: addMonths(new Date(), 1),
  //         },
  //       });
  //     } else {
  //       member = await this.prisma.member.update({
  //         where: { id: user.member.id },
  //         data: {
  //           memberShipType: membershipType,
  //           isActive: true,
  //           startDate: new Date(),
  //           endDate: addMonths(new Date(), 1),
  //         },
  //       });
  //     }

  //     const newRole = membershipType === MemberShipType.BASIC
  //       ? UserRole.USER_BASIC
  //       : membershipType === MemberShipType.PREMIUM
  //       ? UserRole.USER_PREMIUM
  //       : UserRole.USER_DIAMOND;

  //     await this.prisma.users.update({
  //       where: { id: user.id },
  //       data: { role: newRole },
  //     });

  //     await this.prisma.payment.create({
  //       data: {
  //         memberId: member.id,
  //         amount: paymentInfo.transaction_amount,
  //       },
  //     });

  //     this.logger.log('Pago registrado y membresía actualizada con éxito.');
  //     return { message: 'Pago procesado correctamente.' };
  //   } catch (error) {
  //     this.logger.error('Error procesando el pago:', error);
  //     throw new BadRequestException('Error al procesar el pago.');
  //   }
  // }

  // async getPaymentInfo(paymentId: string) {
  //   try {
  //     const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
  //       headers: {
  //         Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     this.logger.error('Error obteniendo información del pago:', error);
  //     throw new BadRequestException('No se pudo obtener información del pago.');
  //   }
  // }




















//   @Injectable()
// export class PaymentService {
//   private mercadoPago: MercadoPagoConfig;

//   constructor(private readonly prisma: PrismaService) {
//     this.mercadoPago = new MercadoPagoConfig({
//       accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
//     });
//   }

//   async createPayment(createPaymentDto: CreatePaymentDto) {
//     try {
//       const payment = new Payment(this.mercadoPago);
//       const response = await payment.create({
//         body: {
//           description: createPaymentDto.description,
//           transaction_amount: createPaymentDto.transactionAmount,
//           payment_method_id: createPaymentDto.paymentMethodId,
//           token: createPaymentDto.token,
//           payer: { email: createPaymentDto.payerEmail },
//           installments: 1,
//         },
//       });

//       if (response.status !== 'approved') {
//         throw new BadRequestException('El pago no fue aprobado');
//       }
      

//       // Buscar el usuario en la base de datos
//       const user = await this.prisma.users.findUnique({
//         where: { email: createPaymentDto.payerEmail },
//         include: { member: true },
//       });

//       if (!user) {
//         throw new BadRequestException('Usuario no encontrado.');
//       }

//       // Verificar si el usuario tiene una membresía activa y no vencida
//       if (user.member && user.member.isActive && new Date(user.member.endDate) > new Date()) {
//       throw new BadRequestException('Ya tienes una membresía activa. No puedes pagar otra hasta que expire.');
//       }

//       // Determinar el tipo de membresía en base al monto pagado
//       let membershipType: MemberShipType;
//       if (createPaymentDto.transactionAmount === 18000) {
//         membershipType = MemberShipType.BASIC;
//       } else if (createPaymentDto.transactionAmount === 30000) {
//         membershipType = MemberShipType.PREMIUM;
//       } else if (createPaymentDto.transactionAmount === 50000) {
//         membershipType = MemberShipType.DIAMOND;
//       } else {
//         throw new BadRequestException('Monto de pago no válido para una membresía.');
//       }

//       let member;
//       if (!user.member) {
//         // Si el usuario no tiene una membresía, crear una nueva
//         member = await this.prisma.member.create({
//           data: {
//             userId: user.id,
//             memberShipType: membershipType,
//             isActive: true,
//             startDate: new Date(),
//             endDate: addMonths(new Date(), 1), // Expira en 1 mes
//           },
//         });
//       } else {
//         // Si ya tiene una membresía, actualizarla
//         member = await this.prisma.member.update({
//           where: { id: user.member.id },
//           data: {
//             memberShipType: membershipType,
//             isActive: true,
//             startDate: new Date(),
//             endDate: addMonths(new Date(), 1),
//           },
//         });
//       }

//       // Actualizar el rol del usuario en base a su membresía
//       const newRole =
//         membershipType === MemberShipType.BASIC
//           ? UserRole.USER_BASIC
//           : membershipType === MemberShipType.PREMIUM
//           ? UserRole.USER_PREMIUM
//           : UserRole.USER_DIAMOND;

//       await this.prisma.users.update({
//         where: { id: user.id },
//         data: { role: newRole },
//       });

//       // Guardar el pago en la base de datos
//       await this.prisma.payment.create({
//         data: {
//           memberId: member.id,
//           amount: createPaymentDto.transactionAmount,
//         },
//       });

//       return { message: 'Pago realizado y membresía actualizada correctamente.' };
//     } catch (error) {
//       console.error('Error al procesar el pago:', error);
//       throw new BadRequestException(`Error de pago: ${error.message || error.response?.message || 'No se pudo procesar el pago.'}`);
//     }
//   }











