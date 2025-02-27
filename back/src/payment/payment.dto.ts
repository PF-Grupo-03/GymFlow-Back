import { ApiProperty } from '@nestjs/swagger';
import { MemberShipType } from "@prisma/client"
import { IsNumber, IsString, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';

export class CreatePaymentDto {
    @ApiProperty({ example: "Pago de Prueba"})
  @IsString()
  @IsNotEmpty()
  description: string;
    @ApiProperty({ example: 1000})
  @IsNumber()
  @IsNotEmpty()
  transactionAmount: number;

  @ApiProperty({ example: "visa"})
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @ApiProperty({ example: "prueba@prueba.com"})
  @IsString()
  @IsNotEmpty()
  payerEmail: string;

  @ApiProperty({ example: "TOKEN_GENERADO_EN_FRONTEND"})
  @IsString()
  @IsNotEmpty()
  token: string;

  // @ApiProperty({ example: "8f2b1e38-4f52-11ed-bdc3-0242ac120002" })
  // @IsUUID()
  // @IsNotEmpty()
  // memberId: string; // ID del usuario que está pagando la membresía

  // @ApiProperty({ example: "PREMIUM", enum: MemberShipType })
  // @IsEnum(MemberShipType)
  // @IsNotEmpty()
  // membershipType: MemberShipType; // Tipo de membresía que se está pagando
}