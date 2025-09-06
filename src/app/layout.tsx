// File: src/app/layout.tsx

import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout/ConditionalLayout";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Murad Hossain | Web Developer & WordPress Designer",
  description:
    "Looking for a professional WordPress Designer and Web Developer? I build fast, secure, and user-friendly websites tailored to your business needs. Contact me for a free consultation!",
  verification: {
    google: "HfnbO6pivguUmdwXN7OgwPFw1JxvOBOBZoefaJPm5xo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${poppins.variable}`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
