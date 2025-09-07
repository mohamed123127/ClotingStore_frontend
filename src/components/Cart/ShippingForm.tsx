"use client"

import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { useTranslation } from 'next-i18next';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import settings from "../../../settings.json"
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn'; 
import Button from '@mui/material/Button';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { removeAllItemsFromCart, selectTotalPrice } from '@/redux/features/cart-slice';
import { clearOrderInfo, setCustomerInfo, setShippingDetaillies } from '@/redux/features/order-slice';
import { customerInfo, shippingDetaillies } from '@/types/orderInfo';
import { useRouter } from "next/navigation";
import Coockies from "js-cookie";

const CustomerInformation = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const customerInformation = useAppSelector((state)=>state.orderInfoSlice.customerInfo);
    return(
        <div className='flex flex-col gap-4 bg-white rounded-lg w-full'>
            <TextField id="outlined" value={customerInformation.lastName} onChange={(e)=>dispatch(setCustomerInfo({...customerInformation,lastName:e.target.value}))} label={t('nom')}/>
            <TextField id="outlined" value={customerInformation.firstName} onChange={(e)=>dispatch(setCustomerInfo({...customerInformation,firstName:e.target.value}))} label={t('prenom')}/>
            <TextField id="outlined" value={customerInformation.phoneNumber} onChange={(e)=>dispatch(setCustomerInfo({...customerInformation,phoneNumber:e.target.value}))} label={t('numeroTelephone')}/>
        </div>
    );
}

const ShippingDetails = ({setShippingFees}) => {
    const { t } = useTranslation();
    const [wilayas, setWilayas] = React.useState([]);
    //const [selectedWilaya,setSelectedWilaya] = useState("");
    const [communes, setCommunes] = React.useState([]);
    //const [selectedCommune,setSelectedCommune] = useState("");
    const [agences, setAgences] = React.useState([]);
    //const [selectedAgence,setSelectedAgence] = useState("");
    //const [address,setAddress] = useState("");
    const [agenceAddress,setAgenceAddress] = useState("");
    const [gps,setGps] = useState("");
    const dispatch = useAppDispatch();
    const shippingDetaillies = useAppSelector((state)=>state.orderInfoSlice.shippingDetaillies) as shippingDetaillies;

    const ShowLocation = () => {
    const url = `https://www.google.com/maps?q=${gps}`;
    window.open(url, "_blank");
  };
    //fetch wilayas
    useEffect(()=>{
        async function getWilayas() {
            const result = await fetch(settings.Api + "yalidine/wilayas");
            if(!result.ok){
                return console.error("Failed to fetch wilayas");
            }

            const data = await result.json();
             //console.log(data);
            setWilayas(data.wilayas);
            //setselectedWilayaId("1");
        }

        getWilayas();
    },[])

    //fetch communes
    useEffect(()=>{
        async function getCommunes() {
            let url = `yalidine/communes/${shippingDetaillies.wilaya.id}`
            if(shippingDetaillies.shippingMethod == "stopDesk"){
                url = `yalidine/communes/${shippingDetaillies.wilaya.id}/hasAgence`
            }
            const result = await fetch(settings.Api + url);
            if(!result.ok){
                return console.error("Failed to fetch communes");
            }

            const data = await result.json();
            // console.log(data);
            setCommunes(data.communes);
            console.info(shippingDetaillies.wilaya);
            //console.info(shippingDetaillies.commune);

            //setSelectedCommune("1");
        }
        if (shippingDetaillies.wilaya.name != ""){
          getCommunes();
          const shippingFees = wilayas.find((w) => w.id === shippingDetaillies.wilaya.id);
          setShippingFees(shippingDetaillies.shippingMethod == "stopDesk" ? shippingFees?.stopDeskTarif : shippingFees?.homeTarif);
        } 
          dispatch(setShippingDetaillies({...shippingDetaillies,agence:{id:null,name:""}}))

    },[shippingDetaillies.wilaya,shippingDetaillies.shippingMethod])
    //fetch agences
    useEffect(()=>{
        async function getAgences() {
            //console.info(shippingDetaillies.commune);
            let url = `yalidine/agences/${shippingDetaillies.commune.id}`
            
            const result = await fetch(settings.Api + url);
            if(!result.ok){
                return console.error("Failed to fetch agences");
            }

            const data = await result.json();
            // console.log(data);
            setAgences(data.agences);
            //setselectedCommuneId("1");
        }

        if (shippingDetaillies.shippingMethod == "stopDesk" && shippingDetaillies.commune.name != ""){
          getAgences();
          //setSelectedAgence("");
          dispatch(setShippingDetaillies({...shippingDetaillies,agence:{id:null,name:""}}))
        }


    },[shippingDetaillies.commune])

    useEffect(()=>{
        const agence = agences.find((a)=>a.id == shippingDetaillies.agence.id);
        //console.log(agences,shippingDetaillies);
        setAgenceAddress(agence?.address);
        setGps(agence?.gps);
        //console.log(agence);
        //setAddress(selectedAgenceId.address);
      
    },[shippingDetaillies.agence.id])

    return(
        <div className='flex flex-col gap-4 bg-white rounded-lg w-full'>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t('willaya')}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={shippingDetaillies.wilaya}
                onChange={(e)=> {
                  const selected = e.target.value as { id: number; name: string };
                  dispatch(setShippingDetaillies({
                    ...shippingDetaillies,
                    wilaya: selected
                  }));
                }}
                 label={t('willaya')}
                 MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 120, // 👈 max height of dropdown
          },
        },
      }}
            >
                {wilayas.map((w) => (
          <MenuItem key={w.id} value={w}>
            {w.name}
          </MenuItem>
        ))}
            </Select>
            </FormControl>

            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t('commune')}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={shippingDetaillies.commune}
                onChange={(e)=> {
                  const selected = e.target.value as { id: number; name: string };
                  //console.info(e.target.value);
                  dispatch(setShippingDetaillies({
                    ...shippingDetaillies,
                    commune: selected
                  }));
                }}
                label={t('Communes')}
                 MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 120, // 👈 max height of dropdown
          },
        },
      }}
            >
                {communes.map((c) => (
          <MenuItem key={c.id} value={c}>
            {c.name}
          </MenuItem>
        ))}
            </Select>
            </FormControl>
            {
              shippingDetaillies.shippingMethod == "stopDesk" ?
              <div>
              <div className='flex'>   
              <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">{t('agence')}</InputLabel>
              <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={shippingDetaillies.agence}
                  onChange={(e)=> {
                  const selected = e.target.value as { id: number; name: string };
                  dispatch(setShippingDetaillies({
                    ...shippingDetaillies,
                    agence: selected
                  }));
                }}
                  label={t('agence')}
                  MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 120, // 👈 max height of dropdown
            },
          },
        }}
              >
                  {agences.map((a) => (
            <MenuItem key={a.id} value={a}>
              {a.name}
            </MenuItem>
          ))}
              </Select>
              </FormControl>

              {shippingDetaillies.agence.name != "" && <IconButton color="primary" aria-label="Agencer location" 
                style={{ padding: '0px'}} onClick={ShowLocation}
>
                <LocationOnIcon fontSize='large'/>
              </IconButton>}
              </div>
               {shippingDetaillies.agence.name != "" && <p>Address: {agenceAddress}</p>}
              </div>
            :
              <TextField id="outlined" value={shippingDetaillies.address} 
                onChange={(e)=> {
                  dispatch(setShippingDetaillies({
                    ...shippingDetaillies,
                    address: e.target.value
                  }));
                }} label={t('address')}/>
            }
        </div>
    );
}

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

const OrderSummary = ({ShippingFees}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const [isTheSaleCompleted,setIsTheSaleCompleted] = useState(true);
  const customerInfo = useAppSelector((state)=>state.orderInfoSlice.customerInfo) as customerInfo;
  const shippingDetaillies = useAppSelector((state)=>state.orderInfoSlice.shippingDetaillies) as shippingDetaillies;
  const dispatch = useAppDispatch();

  const checkoutFunction = async()=>{
   const response = await fetch(settings.Api + "sales", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer: {
        firstName:customerInfo.firstName,
        lastName:customerInfo.lastName,
        phone_number:customerInfo.phoneNumber,
      },
      shippingDetaillies: {
        shippingMethod: shippingDetaillies.shippingMethod,
        wilaya: shippingDetaillies.wilaya.name,
        commune: shippingDetaillies.commune.name,
        stopDeskId: shippingDetaillies.agence.id,
        address: shippingDetaillies.address != "" ? shippingDetaillies.address : "no address"
      },
      soldItems: cartItems.map((item) => {
        return{
        variantId: item.id,
        selling_price: item.price,
        quantity: item.quantity
        }}),
    }),
  });

  if(response.ok){
    const data = await response.json();
    if(data.status == "success")
    Coockies.set("shippingLabel",data?.label);
    
  console.log(data);
  }
}

  const checkoutClick = async()=>{
    setIsTheSaleCompleted(false);
       await checkoutFunction();
       dispatch(removeAllItemsFromCart());
       dispatch(clearOrderInfo());
       //shippingDetaillies);
       setIsTheSaleCompleted(true);
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

const ShippingForm = () => {
    const {t} = useTranslation();
    const [shippingFees,setShippingFees] = useState(0);
  return (
    <div className='w-full flex flex-col md:flex-row h-auto gap-4'>
        <div className='flex flex-col bg-white rounded-lg w-full p-4 '>
          <h3 className="font-medium text-xl mb-4 text-dark">{t('orderAndDeliveryDetails')}</h3>
            <ShippingMethod/>
            <div className='flex md:flex-row flex-col gap-4 mt-2'>
                <CustomerInformation />
                <ShippingDetails setShippingFees={setShippingFees}/>
            </div>
        </div>
        <OrderSummary ShippingFees={shippingFees}/>
    </div>
  )
}

export default ShippingForm
