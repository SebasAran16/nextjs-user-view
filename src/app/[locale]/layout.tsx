import "@/styles/globals.sass";
import "@/styles/variables.module.sass";
import type { Metadata } from "next";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MainHeader from "./components/headers/mainHeader";

export const metadata: Metadata = {
  title: "CustomerView",
  description: "Stayed linked never easier",
  icons: {
    icon: "/favicons/favicon.ico",
    apple: "/favicons/apple-touch-icon.png",
  },
  authors: [{ name: "OwnTheBlock Solutions", url: "" }],
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SpeedInsights />
          <MainHeader />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
