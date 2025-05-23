import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false, // true para 465, false para outras portas
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPasswordResetEmail(
    email: string,
    username: string,
    resetToken: string
  ) {
    const resetUrl = `http://127.0.0.1:5500/frontend/src/reset-password.html?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Recuperação de Senha - Sistema de Usuários",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3498db;">Recuperação de Senha</h2>
          
          <p>Olá <strong>${username}</strong>,</p>
          
          <p>Você solicitou a recuperação de sua senha. Clique no link abaixo para criar uma nova senha:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #3498db; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Recuperar Senha
            </a>
          </div>
          
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          
          <p><strong>Este link expira em 1 hora.</strong></p>
          
          <p>Se você não solicitou esta recuperação, ignore este email.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            © 2025 Sistema de Usuários - Recuperação de Senha
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de recuperação enviado para: ${email}`);
      return true;
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      return false;
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ Configuração de email válida");
      return true;
    } catch (error) {
      console.error("❌ Erro na configuração de email:", error);
      return false;
    }
  }
}

export default new EmailService();
