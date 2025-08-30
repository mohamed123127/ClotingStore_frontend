import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

const OrderSummary = ({ShippingFees}) => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const { t } = useTranslation();

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">{t('OrderSummary')}</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- ProductsValue --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">{t('ProductsValue')}</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">{totalPrice}DA</h4>
            </div>
          </div>

          {/* <!-- ShippingFees --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">{t('ShippingFees')}</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">{ShippingFees}DA</h4>
            </div>
          </div>
         
          {/* <!-- total --> */}
          <div className="flex items-center justify-between pt-5">
            <div>
              <p className="font-medium text-lg text-dark">{t('Total')}</p>
            </div>
            <div>
              <p className="font-medium text-lg text-dark text-right">
                {totalPrice + ShippingFees}DA
              </p>
            </div>
          </div>

          {/* <!-- checkout button --> */}
          <button
            type="submit"
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
          >
            {t('ProcessToCheckout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
