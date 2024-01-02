import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { EmailType } from "@/types/structs/emailType";
import { UserRol } from "@/types/structs/userRol.enum";
import { getUserForVariables } from "@/utils/getUserForVariable";
import { sendEmail } from "@/utils/mailer";
import { NextRequest, NextResponse } from "next/server";
import validateEmail from "deep-email-validator";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    const dateCreated = Date.now();

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    const {
      valid: validEmail,
      reason,
      validators,
    } = await validateEmail(email);
    const reasonToGive = reason as
      | "regex"
      | "typo"
      | "disposable"
      | "mx"
      | "smtp";

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Username or Email already in use",
        },
        { status: 409 }
      );
    } else if (!validEmail && reasonToGive !== "typo") {
      const reasonMessage = validators[reasonToGive]?.reason || "Unknown";

      return NextResponse.json(
        {
          message: "Email not valid. Reason: " + reasonMessage,
        },
        { status: 422 }
      );
    }

    const dateCreatedAsDate = new Date(dateCreated * 1000);

    const newUser = new User({
      username,
      password,
      email,
      createdDate: dateCreatedAsDate,
      rol: UserRol.CUSTOMER,
    });

    const savedUser = await newUser.save();

    await sendEmail({
      email,
      emailType: EmailType.VERIFY,
      userId: savedUser._id,
    });

    return NextResponse.json(
      { message: "Signup completed!", user: getUserForVariables(savedUser) },
      { status: 200 }
    );
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}
