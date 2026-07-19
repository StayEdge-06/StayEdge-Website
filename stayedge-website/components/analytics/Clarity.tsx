"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getConsent } from "@/lib/analytics";

/**
 * Microsoft Clarity via next/script (founder directive).
 * - Loads ONLY in production builds
 * - Project id from NEXT_PUBLIC_CLARITY_PROJECT_ID
 * - Consent-gated (our privacy stance: decline = never loads)
 * - Double-init guarded: skips if window.clarity already exists, and this is
 *   the single Clarity loader in the app (the legacy path was removed).
 */
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export function Clarity() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!CLARITY_PROJECT_ID) return;
    if (typeof window !== "undefined" && window.clarity) return; // already initialised
    const check = () => setReady(getConsent() === "granted");
    check();
    // React to the consent banner being answered in this session.
    window.addEventListener("se-consent", check);
    return () => window.removeEventListener("se-consent", check);
  }, []);

  if (!ready || !CLARITY_PROJECT_ID) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
        if (c[a]) return;
        c[a]=function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
    </Script>
  );
}
