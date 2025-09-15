"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import BackToTopButton from "@/components/BackToTopButton/BackToTopButton";
import TopProgressBar from "../TopProgressBar/TopProgressBar";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // যেসব route-এ header/footer hide করবেন
  const hideHeaderFooter =
    pathname.startsWith("/login") || pathname.startsWith("/dashboard");

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <TopProgressBar />
      <main>{children}</main>
      {!hideHeaderFooter && <Footer />}
      {!hideHeaderFooter && <BackToTopButton />}
    </>
  );
}
