'use client'
import Link from "next/link";
import { useTranslation } from 'next-i18next';

export default function FeatureUnderDevelopment() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center w-full my-32">
      <h1 className="mt-48 text-2xl font-bold text-gray-800">
        {t('UnderDevelopment')} 🚧
      </h1>
      <p className="mt-2 text-gray-600 text-center max-w-md">
       {t('WorkingOnFeature')}
      </p>
      <Link href="/" className="mt-6 px-6 py-2 bg-blue-500 bg-blue text-white font-medium rounded-xl shadow hover:bg-blue-600 transition duration-300">
        {t('BackToHome')}
      </Link>
    </div>
  );
}
