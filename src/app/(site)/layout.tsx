"use client";

import { useState, useEffect } from "react";
import "../../config/i18n"; // ⭐ استدعاء i18n مرة واحدة
import "../css/euclid-circular-a-font.css";
import "../css/style.css";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import { dir } from 'i18next';
import i18n from '../../config/i18n';
import { usePathname } from "next/navigation";

import Script from "next/script";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "ar" === "ar" ? "rtl" : "ltr";
    i18n.changeLanguage("ar");
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (pathname.startsWith("/admin")) {
    return <html lang="en" dir="ltr">
      <body>
        {children}
      </body>
    </html>; // بدون Layout
  }
  return (
    <html lang="ar" suppressHydrationWarning={true}>
     <head>
        {/* ✅ Meta Pixel Script */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '748170171382174');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=748170171382174&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body>
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <ReduxProvider>
              <CartModalProvider>
                <ModalProvider>
                  <PreviewSliderProvider>
                    <Header />
                    {children} {/* ✅ هنا الصفحات تُعرض */}
                    <QuickViewModal />
                    <CartSidebarModal />
                    <PreviewSliderModal />
                  </PreviewSliderProvider>
                </ModalProvider>
              </CartModalProvider>
            </ReduxProvider>
            <ScrollToTop />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
