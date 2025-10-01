"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { AppDispatch, useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { removeAllItemsFromWishlist } from "@/redux/features/wishlist-slice";

export const Wishlist = () => {
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
  const handleRemoveAllFromWishlist = () => {
      dispatch(removeAllItemsFromWishlist());
    };
  return (
    <>
      <Breadcrumb title={"Wishlist"} pages={["Wishlist"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">{t('yourWishlist')}</h2>
            <button className="text-blue" onClick={handleRemoveAllFromWishlist}>{t('clearWishlistCart')}</button>
          </div>

          <div className="bg-white rounded-[10px] shadow-1">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1170px]">
                {/* <!-- table header --> */}
                <div className="flex items-center py-5.5 px-10">
                  <div className="min-w-[83px]"></div>
                  <div className="min-w-[387px] w-full">
                    <p className="text-dark">{t('Product')}</p>
                  </div>

                  <div className="min-w-[205px]">
                    <p className="text-dark text-center">{t('Price')}</p>
                  </div>

                  <div className="min-w-[150px]">
                    <p className="text-dark text-center">{t('action')}</p>
                  </div>
                </div>

                {/* <!-- wish item --> */}
                {wishlistItems.length > 0 ? 
                wishlistItems.map((item, key) => (
                  <SingleItem item={item} key={key} />
                )) 
              : 
              <p className="text-center my-16 text-lg">{t('noProductInWishlist')}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
