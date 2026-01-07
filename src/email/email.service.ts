import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${process.env.APP_URL}/auth/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: '"Bloom App" <no-reply@bloom.com>',
      to,
      subject: 'Resetare parolă Bloom',
      html: `
        <h2>Resetare parolă</h2>
        <p>Ai cerut resetarea parolei pentru contul tău Bloom.</p>
        <p>Apasă pe linkul de mai jos pentru a seta o parolă nouă:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Linkul expiră în 30 de minute.</p>
      `,
    });
  }
}
