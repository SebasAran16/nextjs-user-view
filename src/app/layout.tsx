import "@/styles/globals.sass";
import "@/styles/variables.module.sass";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer View",
  description: "Stayed linked never easier",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
