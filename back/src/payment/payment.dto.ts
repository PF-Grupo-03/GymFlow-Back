
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreatePreferenceDto {
  @ApiProperty({ example: "Pago de Membresía Premium" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 30000 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: "12345-usuario-id" })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: "usuario@email.com" })
  @IsString()
  @IsNotEmpty()
  userEmail: string;
}

export class ProcessPaymentDto {
  @ApiProperty({ example: "1234567890" })
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @ApiProperty({ example: "approved" })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: 30000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: "usuario@email.com" })
  @IsString()
  @IsNotEmpty()
  userEmail: string;
}





























// import { ApiProperty } from '@nestjs/swagger';
// import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

// export class CreatePaymentDto {
//   @ApiProperty({ example: "Pago de Prueba"})
//   @IsString()
//   @IsNotEmpty()
//   description: string;
  
//   @ApiProperty({ example: 18000})
//   @IsNumber()
//   @IsNotEmpty()
//   transactionAmount: number;

//   // @ApiProperty({ example: "visa"})
//   // @IsString()
//   // @IsNotEmpty()
//   // paymentMethodId: string;

//   @ApiProperty({ example: "prueba@prueba.com"})
//   @IsString()
//   @IsNotEmpty()
//   payerEmail: string;

//   // @ApiProperty({ example: "TOKEN_GENERADO_EN_FRONTEND"})
//   // @IsString()
//   // @IsNotEmpty()
//   // token: string;

// }