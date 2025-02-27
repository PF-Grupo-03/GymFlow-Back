import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

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
}