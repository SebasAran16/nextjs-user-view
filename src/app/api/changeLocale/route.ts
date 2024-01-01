import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { locale } = await request.json();

    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 6,
      currentDate.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds()
    );

    cookies().set("NEXT_LOCALE", locale, {
      httpOnly: true,
      expires: expirationDate,
    });

    return NextResponse.json({
      message: "Locale changed successfully!",
      success: true,
    });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
