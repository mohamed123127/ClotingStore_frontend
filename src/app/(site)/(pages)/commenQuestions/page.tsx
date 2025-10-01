"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useSearchParams } from "next/navigation";

type FAQProps = {
  id: string;
  question: string;
  answer: string;
  isOpen?: boolean;
};

const FAQItem = ({ id, question, answer, isOpen = false }: FAQProps) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <div id={id} className="border-b py-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-800 hover:text-indigo-600 transition"
      >
        <span className={`${isOpen ? 'font-bold' : ''}`}>{question}</span>
        <ChevronDown
          className={`w-5 h-5 transform transition-transform duration-300 ${
            open ? "rotate-180 text-indigo-600" : "rotate-0"
          }`}
        />
      </button>
      {open && (
        <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line">
          {answer}
        </p>
      )}
    </div>
  );
};

export default function StoreInfoPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const questionId = searchParams.get("questionId"); // يجيب ?questionId=order


  const faqs = [
    {
      id: "order",
      question: t("order_question"),
      answer: t("order_answer"),
    },
    {
      id: "exchange",
      question: "سياسة الاستبدال",
      answer:
        "نحرص على رضاكم التام. في حال وجود مشكلة في المنتج (مقاس، لون، عيب مصنعي)، يمكنكم طلب الاستبدال خلال 7 أيام من تاريخ الاستلام. يجب أن يكون المنتج بحالته الأصلية مع التغليف والفاتورة. رسوم الشحن يتحملها المتجر في حال وجود خطأ من طرفنا.",
    },
    {
      id: "tracking",
      question: "كيف يمكنني تتبع طلبي؟",
      answer: "بعد شحن الطلب ستصلك رسالة برقم التتبع لتتمكن من متابعة مساره.",
    },
    {
      id: "payment",
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نوفر الدفع عند الاستلام، إضافة إلى الدفع الإلكتروني عبر البطاقات.",
    },
    {
      id: "cancel",
      question: "هل يمكنني إلغاء طلبي؟",
      answer:
        "نعم، يمكنك إلغاء الطلب قبل عملية الشحن عبر التواصل مع خدمة العملاء.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-10 text-indigo-600">
          متجرنا الإلكتروني
        </h1>

        {/* الأسئلة الشائعة */}
        <section className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-500">
            ❓ الأسئلة الشائعة
          </h2>

          <div className="space-y-2">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.id}
                id={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={faq.id === questionId} // ✅ يفتح تلقائي إذا مطابق
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
