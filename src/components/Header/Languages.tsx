"use client"
import React, { useEffect, useState } from 'react'
import { useTranslation, UseTranslation } from 'next-i18next';

export default function Languages (){
    const languages = ["en", "ar", "fr"];

    const [isOpened, setIsOpened] = useState(false); 
    const { i18n } = useTranslation();

    const LanguageChangeHandled = (lang:string) => {
        i18n.changeLanguage(lang);

        if (typeof window !== "undefined") {
          document.documentElement.lang = lang;
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        }
    };

    useEffect(() => {
      document.documentElement.lang = i18n.language;
      document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    }, []);

    return ( 
        <div onClick={() => { setIsOpened(!isOpened); }} className={`flex bg-white shadow-md rounded-lg overflow-hidden cursor-pointer text-nowrap transition-width duration-500 ease-in-out`} style={{ width: isOpened ? "90px" : "30px" }}> 
          {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => LanguageChangeHandled(lang)}
                className={`
                  w-[30px]
                  ${i18n.language === lang ? "bg-[#3C50E0] text-white order-1" : "bg-white order-0"}
                  ${isOpened ? "pointer-events-auto" : "pointer-events-none"}
                  ${isOpened || i18n.language === lang ? "visible" : "hidden"}
                  hover:bg-blue-light hover:text-white
                `}>
              {lang}
            </button>
          ))}
        </div> 
    ); 
}

