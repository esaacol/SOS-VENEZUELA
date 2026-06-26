"use client";

import { useEffect, useState } from "react";

function isAndroidAppWebView() {
  if (typeof navigator === "undefined") return false;
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("capacitor") || (userAgent.includes("wv") && userAgent.includes("android"));
}

export function HideInApp({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(isAndroidAppWebView());
  }, []);

  if (hidden) return null;
  return <>{children}</>;
}
