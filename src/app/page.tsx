"use client";

import { Suspense } from "react";
import AboutSection from "@/components/AboutSection/AboutSection";
import BlogSection from "@/components/BlogSection/BlogSection";
import ContactSection from "@/components/ContactSection/ContactSection";
import HeroSection from "@/components/HeroSection/HeroSection";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
import PricingSection from "@/components/PricingSection/PricingSection";
import ServiceSection from "@/components/ServiceSection/ServiceSection";
import TestimonialSection from "@/components/TestimonialSection/TestimonialSection";
import SectionScroller from "@/components/SectionScroller/SectionScroller";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <SectionScroller />
      </Suspense>

      <main>
        <HeroSection />
        <ServiceSection />
        <AboutSection />
        <PortfolioSection />
        <TestimonialSection />
        <PricingSection />
        <BlogSection />
        <ContactSection />
      </main>
    </>
  );
}
