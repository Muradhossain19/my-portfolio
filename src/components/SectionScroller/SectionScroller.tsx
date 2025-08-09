"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const SectionScroller = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const sectionId = searchParams.get("section");

    if (sectionId) {
      // পেজটি সম্পূর্ণ লোড হওয়ার জন্য একটি নির্ভরযোগ্য ডিলে দিন
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });

          // URL থেকে section=... অংশটি সরিয়ে ফেলুন
          const newPath = pathname.split("?")[0];
          router.replace(newPath, { scroll: false });
        }
      }, 300); // ডিলে 300ms করা হলো

      return () => clearTimeout(timeoutId);
    }
  }, [searchParams, pathname, router]);

  return null; // এই কম্পোনেন্টটি কিছু রেন্ডার করবে না
};

export default SectionScroller;
