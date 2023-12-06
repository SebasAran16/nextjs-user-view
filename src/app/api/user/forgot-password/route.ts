import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { sendEmail } from "@/utils/mailer";
import dbConnect from "@/lib/mongoConnection";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email } = await request.json();

    const user = await User.findOne({ email });

    if (!user)
      return NextResponse.json(
        {
          success: false,
          message: "No account associated with the email",
        },
        { status: 400 }
      );

    await sendEmail({ email, emailType: 1, userId: user._id });

    return NextResponse.json({
      success: true,
      message: "Check your mail for resetting your password!",
    });
  } catch (err: any) {
    NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
