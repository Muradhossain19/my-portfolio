"use client";

import { useEffect } from "react";
import HeroSection from "../components/HeroSection/HeroSection";
import ServiceSection from "../components/ServiceSection/ServiceSection";
import AboutSection from "../components/AboutSection/AboutSection";
import PortfolioSection from "../components/PortfolioSection/PortfolioSection";
import TestimonialSection from "../components/TestimonialSection/TestimonialSection";
import PricingSection from "../components/PricingSection/PricingSection";
import BlogSection from "../components/BlogSection/BlogSection";
import ContactSection from "../components/ContactSection/ContactSection";

export default function Home() {
  useEffect(() => {
    const handler = (e: Event) => {
      const section = (e as CustomEvent).detail;
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("scroll-to-section", handler);
    return () => window.removeEventListener("scroll-to-section", handler);
  }, []);

  return (
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
  );
}
