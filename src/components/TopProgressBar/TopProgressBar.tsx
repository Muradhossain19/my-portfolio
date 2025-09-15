"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./progressbar.css";

NProgress.configure({ showSpinner: false });

export default function TopProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.set(0.3);
    NProgress.inc();
    NProgress.done();
  }, [pathname]);

  return null;
}
