import { Injectable, Logger } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);

  private readonly successURL = process.env.SUCCESS_PAYMENT_URL || 'https://gym-flow-front.vercel.app/payment-success';
  private readonly failureURL = process.env.FAILURE_PAYMENT_URL || 'https://gym-flow-front.vercel.app/payment-failure';
  private readonly pendingURL = process.env.PENDING_PAYMENT_URL || 'https://gym-flow-front.vercel.app/payment-pending';
  private readonly frontendURL = process.env.FRONTEND_URL || 'https://gym-flow-front.vercel.app';

  private client: MercadoPagoConfig;

  constructor(private readonly userService: UsersService) {
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      this.logger.error(
        'MERCADOPAGO_ACCESS_TOKEN no está configurado en las variables de entorno.',
      );
      throw new Error(
        'MERCADOPAGO_ACCESS_TOKEN es obligatorio en las variables de entorno.',
      );
    }

    try {
      this.client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      });
      this.logger.log('MercadoPago configurado exitosamente');
    } catch (error: any) {
      this.logger.error('Error al configurar MercadoPago:', error.message);
      throw new Error('Error al configurar MercadoPago');
    }
  }

  async createPreference(
    product: { title: string; price: number },
    userId: string,
    userEmail: string,
  ) {
    this.logger.log(`Creando preferencia para el producto: ${JSON.stringify(product)}`);
  
    // Si llegas a esta parte, la solicitud fue recibida por el backend
    const preferenceData: PreferenceCreateData = {
      body: {
        items: [
          {
            id: '1',
            title: product.title,
            unit_price: product.price,
            quantity: 1,
            currency_id: 'ARS',
          },
        ],
        auto_return: 'approved',
        back_urls: {
          success: this.successURL,
          failure: this.failureURL,
          pending: this.pendingURL,
        },
        payer: {
          email: userEmail,
          name: 'Lalo',
          surname: 'Landa',
          identification: {
            type: 'DNI',
            number: '22333444',
          },
        },
        payment_methods: {
          excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }],
          installments: 1,
        },
        binary_mode: true,
        expires: false,
        statement_descriptor: 'Tu Empresa',
        external_reference: userId,
      },
    };
  
    try {
      const preferenceClient = new Preference(this.client);
      const response = await preferenceClient.create(preferenceData);
      this.logger.log('Preferencia creada exitosamente:', response);
  
      return response; // Asegúrate de devolver la respuesta de la preferencia creada
    } catch (error: any) {
      const errorDetails = error.response?.data || error.message;
      this.logger.error('Error al crear la preferencia:', errorDetails);
      throw new Error(`Error al crear la preferencia: ${errorDetails}`);
    }
  }
  

  async checkPaymentStatus(paymentId: string) {
    try {
      return { status: 'approved' }; // Simulación de estado aprobado
    } catch (error: any) {
      this.logger.error(
        'Error al verificar el estado del pago:',
        error.message,
      );
      throw new Error(
        `Error al verificar el estado del pago: ${error.message}`,
      );
    }
  }
}