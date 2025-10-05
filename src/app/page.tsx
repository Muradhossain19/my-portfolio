"use client";

import Head from "next/head";
import { Suspense } from "react";
import AboutSection from "@/components/AboutSection/AboutSection";
import BlogSection from "@/components/BlogSection/BlogSection";
import ContactSection from "@/components/ContactSection/ContactSection";
import HeroSection from "@/components/HeroSection/HeroSection";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
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
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Murad Hossain Portfolio",
                url: "https://www.muradhossain.com",
                potentialAction: {
                  "@type": "SearchAction",
                  target:
                    "https://www.muradhossain.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Murad Hossain",
                url: "https://www.muradhossain.com",
                logo: "https://www.muradhossain.com/images/hero-image.webp",
                sameAs: [
                  "https://web.facebook.com/murad.hossain.685",
                  "https://x.com/MuradHo93458407",
                  "https://www.linkedin.com/in/wordpress-developer-murad/",
                  "https://github.com/Muradhossain19",
                  "https://www.instagram.com/muradhossainpintu/",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Murad Hossain",
                url: "https://www.muradhossain.com",
                jobTitle: "Web Developer & WordPress Designer",
                image: "https://www.muradhossain.com/images/hero-image.webp",
                description:
                  "Looking for a professional WordPress Designer and Web Developer? I build fast, secure, and user-friendly websites tailored to your business needs. Contact me for a free consultation!",
              },
              {
                "@context": "https://schema.org",
                "@type": "Service",
                name: "Web Development",
                url: "https://www.muradhossain.com/services/web-development",
                description:
                  "Professional web development services for businesses and individuals.",
                provider: {
                  "@type": "Person",
                  name: "Murad Hossain",
                },
                areaServed: "Worldwide",
                serviceType: "Web Development",
              },
              {
                "@context": "https://schema.org",
                "@type": "Service",
                name: "WordPress Solutions",
                url: "https://www.muradhossain.com/services/wordpress",
                description:
                  "Custom WordPress design and development services.",
                provider: {
                  "@type": "Person",
                  name: "Murad Hossain",
                },
                areaServed: "Worldwide",
                serviceType: "WordPress Solutions",
              },
              {
                "@context": "https://schema.org",
                "@type": "Service",
                name: "E-commerce Solutions",
                url: "https://www.muradhossain.com/services/ecommerce",
                description: "E-commerce website development and integration.",
                provider: {
                  "@type": "Person",
                  name: "Murad Hossain",
                },
                areaServed: "Worldwide",
                serviceType: "E-commerce Solutions",
              },
            ]),
          }}
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
