"use client"
// src/app/ThanksForPurchase.tsx
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";


export default function ThanksForPurchase() {

  const handleDownload = () => {
    const shippingLabel = Cookies.get("shippingLabel");
    Cookies.set("shippingLabel",null);
    //console.log(shippingLabel);
    if (!shippingLabel) alert("Shipping label not found")
      else window.open(shippingLabel, "_blank");

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      {/* أيقونة ✅ */}
      <CheckCircle className="w-24 h-24 text-green-500" />

      {/* النصوص */}
      <h1 className="mt-6 text-2xl font-bold text-gray-800">
        تم إكمال طلبك بنجاح 🎉
      </h1>
      <p className="mt-2 text-gray-600">
        شكراً لثقتك بنا! فريقنا سيتصل بك قريباً لتأكيد تفاصيل الطلبية.
      </p>

      {/* الأزرار */}
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <button className="px-6 py-2 rounded-2xl shadow-md bg-blue text-white hover:bg-blue-light">
            العودة إلى المتجر
          </button>
        </Link>
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-green hover:bg-green-light text-white rounded-2xl shadow-md"
        >
          تحميل ملصق الشحن
        </button>
      </div>
    </div>
  );
}
