"use client"

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ShippingMethod from "./ShippingMethod";
import CustomerInformation from "./CustomerInformation";
import ShippingDetails from "./ShippingDetails";
import OrderSummary from "./OrderSummary";
import { ZodIssue } from "zod";


const ShippingForm = () => {
    const {t} = useTranslation();
    const [shippingFees,setShippingFees] = useState(0);
const [errors, setErrors] = useState<ZodIssue[]>([]);
  return (
    <div className='w-full flex flex-col md:flex-row h-auto gap-4'>
        <div className='flex flex-col bg-white rounded-lg w-full p-4 '>
          <h3 className="font-medium text-xl mb-4 text-dark">{t('orderAndDeliveryDetails')}</h3>
            <ShippingMethod/>
            <div className='flex md:flex-row flex-col gap-4 mt-2'>
                <CustomerInformation />
                <ShippingDetails setShippingFees={setShippingFees}/>
            </div>
        {errors && errors.length > 0 && <p className="text-red-dark">{errors[0].message}</p>}
        </div>
        <OrderSummary ShippingFees={shippingFees} setErrors={setErrors}/>
    </div>
  )
}

export default ShippingForm
