import { setShippingDetaillies } from "@/redux/features/order-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { shippingDetaillies } from "@/types/orderInfo";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useTranslation } from "react-i18next";

import React from 'react'

const ShippingMethod = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const shippingDetaillies = useAppSelector((state)=>state.orderInfoSlice.shippingDetaillies) as shippingDetaillies;

    const handleChange = (e)=>{
        if(e.target.value == "stopDesk") dispatch(setShippingDetaillies({...shippingDetaillies,shippingMethod:"stopDesk"}));
        else dispatch(setShippingDetaillies({...shippingDetaillies,shippingMethod:"home"}));
    }

    return(
        <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">{t('deliveryMethod')}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        defaultValue='stopDesk'
        value={shippingDetaillies.shippingMethod}
        onChange={handleChange}
      >
        <FormControlLabel value='stopDesk' control={<Radio />} label={t('pickupPointDelivery')} />
        <FormControlLabel value='home' control={<Radio />} label={t('homeDelivery')} />
      </RadioGroup>
    </FormControl>
    );
}

export default ShippingMethod;
