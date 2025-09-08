import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { shippingDetaillies } from "@/types/orderInfo";
import { setShippingDetaillies } from "@/redux/features/order-slice";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

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
};

export default ShippingMethod;
