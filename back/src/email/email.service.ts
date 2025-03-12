import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { SendEmailDto } from './email.dto';

dotenv.config();

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // 🔥 Desactiva la verificación del certificado SSL
      },
    });
  }

  async sendEmail({ to, subject, content, eventType }: SendEmailDto) {
    try {
      const info = await this.transporter.sendMail({
        from: `"GymFlow" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: content,
      });
      console.log('Correo enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return { success: false, error };
    }
  }
}
