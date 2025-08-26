"use client";
import React from 'react';
import { useTranslation } from 'next-i18next';

const StartView = () => {
  const { t } = useTranslation();
  return (
    <div className='w-full h-96 bg-green flex justify-start items-center'>
      <h1 className='text-white'>{t('welcome')}</h1>
      <p>asd</p>
    </div>
  );
};

export default StartView;
