import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useSelector } from 'react-redux';
import { customerInfo, shippingDetaillies } from '@/types/orderInfo';
import Coockies from "js-cookie";
import { removeAllItemsFromCart, selectTotalPrice } from '@/redux/features/cart-slice';
import { clearOrderInfo } from '@/redux/features/order-slice';
import { z } from 'zod';

const OrderSummary = ({ShippingFees,setErrors}) => {
   const { t } = useTranslation();
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const customerInfo = useAppSelector((state)=>state.orderInfoSlice.customerInfo) as customerInfo;
  const shippingDetaillies = useAppSelector((state)=>state.orderInfoSlice.shippingDetaillies) as shippingDetaillies;
  const dispatch = useAppDispatch();
  const [isTheSaleCompleted,setIsTheSaleCompleted] = useState(true);

  const orderSchema = z.object({
        customer: z.object({
          lastName: z.string().nonempty("يجب عليك ادخال اللقب"),
          firstName: z.string().nonempty("يجب عليك ادخال الاسم"),
          phone_number: z.string().length(10, "رقم الهاتف غير صالح").regex(/^0(5|6|7)\d{8}$/, "رقم الهاتف غير صالح"),
        }),
        shippingDetaillies: z.object({
          shippingMethod: z.enum(["stopDesk","home"],"التوصيل يجب ان يكون للمنزل او لمكتب شركة التوصيل"),
          wilaya: z.string().nonempty("يجب عليك اختيار الولاية"),
          commune: z.string().nonempty("يجب عليك اختيار البلدية"),
          stopDeskId: z.string().superRefine((val, ctx) => {
  if (shippingDetaillies.shippingMethod === "stopDesk") {
    if (val === "") {
      ctx.addIssue({
        code: "custom",
        message: "يجب عليك اختيار مكتب التوصيل",
      });
    } else if (val.length < 5 || val.length > 6) {
      ctx.addIssue({
        code: "custom",
        message: "مكتب التوصيل المختار غير صالح",
      });
    }
  }
}),
          address: z.string().nonempty("يجب عليك ادخال العنوان")
        })
      })

  const checkoutFunction = async()=>{
    const bodyData = {
      customer: {
        firstName:customerInfo.firstName,
        lastName:customerInfo.lastName,
        phone_number:customerInfo.phoneNumber,
      },
      shippingDetaillies: {
        shippingMethod: shippingDetaillies.shippingMethod,
        wilaya: shippingDetaillies.wilayaName,
        commune: shippingDetaillies.communeName,
        stopDeskId: shippingDetaillies.agenceId.toString(),
        address: shippingDetaillies.shippingMethod == "stopDesk" ? "no address" : shippingDetaillies.address 
      },
      soldItems: cartItems.map((item) => {
        return{
        variantId: item.id,
        selling_price: item.price,
        quantity: item.quantity
        }}),
    };
      // console.info(bodyData);

    try{
      orderSchema.parse(bodyData);
    }catch(err){
      if(err instanceof z.ZodError)
    setErrors(err.issues);
      return false;
    }
    const jsonBodyData = JSON.stringify(bodyData);
    const response = await fetch(process.env.NEXT_PUBLIC_Default_Api_Url + "sales", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonBodyData,
  });

  if(response.ok){
    const data = await response.json();
    if(data.status == "success")
    Coockies.set("shippingLabel",data?.label);
    
  //console.log(data);
  return true;
  }
}

  const checkoutClick = async()=>{
    setIsTheSaleCompleted(false);
       const isCheckoutsuccess = await checkoutFunction();
       setIsTheSaleCompleted(true);
       if(!isCheckoutsuccess) return;
       dispatch(removeAllItemsFromCart());
       dispatch(clearOrderInfo());
       //shippingDetaillies);
       router.push("/ThnaksForPurshase")
  }
  
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
          <div className="flex items-center justify-between pt-5 mb-6">
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
          <Button
          size="small"
          className="w-full h-12 flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
          onClick={checkoutClick}
          loading={!isTheSaleCompleted}
          loadingPosition="start"
          variant="contained"
        >
          {t('ProcessToCheckout')}
        </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;