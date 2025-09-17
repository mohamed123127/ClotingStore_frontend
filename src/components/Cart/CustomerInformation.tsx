import { setCustomerInfo } from "@/redux/features/order-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import React, { useEffect } from 'react'
import { z } from "zod";
import { on } from "node:events";

const CustomerInformation = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const customerInformation = useAppSelector((state)=>state.orderInfoSlice.customerInfo);

    return(
        <div className='flex flex-col gap-4 bg-white rounded-lg w-full'>
            <TextField id="outlined" value={customerInformation.lastName} onChange={(e) => dispatch(setCustomerInfo({...customerInformation,lastName:e.target.value}))} label={t('nom')}/>
            <TextField id="outlined" value={customerInformation.firstName} onChange={(e) => dispatch(setCustomerInfo({...customerInformation,firstName:e.target.value}))} label={t('prenom')}/>
            <TextField id="outlined" value={customerInformation.phoneNumber} onChange={(e) => dispatch(setCustomerInfo({...customerInformation,phoneNumber:e.target.value}))} label={t('numeroTelephone')}/>
            <input type="text" name="website" className="hidden" autoComplete="off" value={customerInformation.website} onChange={(e) => dispatch(setCustomerInfo({...customerInformation,website:e.target.value}))}/>
        </div>
    );
}

export default CustomerInformation
