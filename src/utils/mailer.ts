import nodemailer from "nodemailer";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { EmailType } from "@/types/structs/emailType";
import * as jose from "jose";

interface sendMailOptions {
  email: string;
  emailType: EmailType;
  userId?: any;
  information?: Record<string, string>;
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
  information,
}: sendMailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    let hashedToken: string | undefined;
    if (userId) {
      const hashTokenSymbols = await bcrypt.hash(userId.toString(), 10);
      hashedToken = hashTokenSymbols.replace(/[^a-zA-Z0-9]/g, "");

      if (emailType === EmailType.VERIFY) {
        await User.findByIdAndUpdate(userId, {
          verify_token: hashedToken,
          verify_token_expiry: Date.now() + 3600000,
        });
      } else if (emailType == EmailType.RESET) {
        await User.findByIdAndUpdate(userId, {
          forgot_password_token: hashedToken,
          forgot_password_token_expiry: Date.now() + 3600000,
        });
      }
    }

    const mailOptions = await constructMailOptions(
      emailType,
      email,
      hashedToken,
      information ?? undefined
    );

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

async function constructMailOptions(
  emailType: EmailType,
  email: string,
  hashedToken: string | undefined,
  information?: Record<string, string>
) {
  switch (emailType) {
    case EmailType.VERIFY:
      return {
        from: "customerview@gmail.com",
        to: email,
        subject: "CustomerView - Verify your Email",
        html: `<p>Click <a href="${process.env.DOMAIN}/verify-email?token=${hashedToken}">here</a> to verify your email!</p>
        <br>
        <p>Or copy and past this link on your browser: <br> ${process.env.DOMAIN}/verify-email?token=${hashedToken}</p>`,
      };
    case EmailType.RESET:
      return {
        from: "customerview@gmail.com",
        to: email,
        subject: "CustomerView - Reset your password",
        html: `<p>Click <a href="${process.env.DOMAIN}/forgot-password/reset?token=${hashedToken}">here</a> to reset your password!</p>
        <br>
        <p>Or copy and past this link on your browser: <br> ${process.env.DOMAIN}/forgot-password/reset?token=${hashedToken}</p>`,
      };
    case EmailType.DENIAL:
      return {
        from: "customerview@gmail.com",
        to: email,
        subject: "CustomerView - KYC Request Denial",
        html: `<p>This email has been sent to inform you that your KYC petition has been rejected.</p>
        <br />
        <p>Reason of rejection:</p>
        <br />
        <p>${information!.denialReason}</p>
        `,
      };
    default:
      throw new Error(`Mail type ${emailType} not supported`);
  }
}
