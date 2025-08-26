'use client'
import React from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    title: "fastShipping",
    description: "deliveryTime",
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "1 & 1 Returns",
    description: "Cancellation after 1 day",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "quality",
    description: "highQualityGoods",
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "support",
    description: "anywhere",
  },
];


const HeroFeature = () => {
  const {t} = useTranslation();
  return (
    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="flex flex-wrap justify-center items-center gap-7.5 xl:gap-12.5 mt-10">
        {featureData.map((item, key) => (
          <div className="flex items-center gap-4" key={key}>
            <Image src={item.img} alt="icons" width={40} height={41} />

            <div>
              <h3 className="font-medium text-lg text-dark">{t(item.title)}</h3>
              <p className="text-sm">{t(item.description)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
