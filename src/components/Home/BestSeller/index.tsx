'use client'

import React, { useEffect, useState } from "react";
import SingleItem from "./SingleItem";
import Image from "next/image";
import Link from "next/link";
import shopData, { getProducts } from "@/components/Shop/shopData";
import { useTranslation } from "next-i18next";
import { Product } from "@/types/product";


const BestSeller = () => {
  const { t } = useTranslation();
  const [shopData, setShopData] = useState<Product[]>([]);

  useEffect(() => {
    getProducts(1,5)
      .then((data) => {
        setShopData(data);
      })
      .catch((err) => console.error(err))
  }, []);
  return (

    <section className="overflow-hidden mt-16">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              {t('thisMonth')}
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
            {t('bestSellers')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {/* <!-- Best Sellers item --> */}
          {shopData.slice(0, 5).map((item, key) => (
            <SingleItem item={item} key={key} />
          ))}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop-without-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            {t('viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
