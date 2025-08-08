// File: src/app/layout.tsx

import { Montserrat, Poppins } from "next/font/google"; // দুটি ফন্টই ইমপোর্ট করুন
import "./globals.css";
import Header from "@/components/Header/Header";

// Montserrat ফন্ট লোড করুন (হেডিং ও বাটনের জন্য)
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat", // CSS ভ্যারিয়েবল
});

// Poppins ফন্ট লোড করুন (বডি টেক্সটের জন্য)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-poppins", // CSS ভ্যারিয়েবল
});

export const metadata = {
  title: "Murad Hossain - Portfolio",
  description: "Personal portfolio of Murad Hossain, a skilled web developer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* দুটি ফন্ট ভ্যারিয়েবলই <html> ট্যাগে যোগ করুন */}
      <body
        className={`${montserrat.variable} ${poppins.variable} bg-background text-foreground`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
