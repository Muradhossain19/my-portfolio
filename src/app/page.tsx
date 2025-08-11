"use client";

import Head from "next/head";
import { Suspense } from "react";
import AboutSection from "@/components/AboutSection/AboutSection";
import BlogSection from "@/components/BlogSection/BlogSection";
import ContactSection from "@/components/ContactSection/ContactSection";
import HeroSection from "@/components/HeroSection/HeroSection";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
// import PricingSection from "@/components/PricingSection/PricingSection";
import ServiceSection from "@/components/ServiceSection/ServiceSection";
import TestimonialSection from "@/components/TestimonialSection/TestimonialSection";
import SectionScroller from "@/components/SectionScroller/SectionScroller";

export default function Home() {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Murad Hossain",
              url: "https://www.muradhossain.com",
              jobTitle: "Murad Hossain | Web Developer & WordPress Designer",
              image: "https://www.muradhossain.com/images/hero-image.webp",
              description:
                "Looking for a professional WordPress Designer and Web Developer? I build fast, secure, and user-friendly websites tailored to your business needs. Contact me for a free consultation!",
            }),
          }}
        />

        <meta
          name="google-site-verification"
          content="HfnbO6pivguUmdwXN7OgwPFw1JxvOBOBZoefaJPm5xo"
        />
      </Head>
      <Suspense fallback={null}>
        <SectionScroller />
      </Suspense>

      <main>
        <HeroSection />
        <ServiceSection />
        <AboutSection />
        <PortfolioSection />
        <TestimonialSection />
        {/* <PricingSection /> */}
        <BlogSection />
        <ContactSection />
      </main>
    </>
  );
}
