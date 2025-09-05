import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { useTranslation } from 'next-i18next';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OrderSummary from './OrderSummary';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import settings from "../../../settings.json"
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn'; 

const CustomerInformation = () => {
    const { t } = useTranslation();
    const [customerInformation,setCustomerInformation] = useState({
      firstName:"",
      lastName:"",
      phoneNumber:"",
    })
    return(
        <div className='flex flex-col gap-4 bg-white rounded-lg w-full'>
            <TextField id="outlined" value={customerInformation.lastName} onChange={(e)=>setCustomerInformation((prev)=>({...prev,lastName:e.target.value}))} label={t('nom')}/>
            <TextField id="outlined" value={customerInformation.firstName} onChange={(e)=>setCustomerInformation((prev)=>({...prev,firstName:e.target.value}))} label={t('prenom')}/>
            <TextField id="outlined" value={customerInformation.phoneNumber} onChange={(e)=>setCustomerInformation((prev)=>({...prev,phoneNumber:e.target.value}))} label={t('numeroTelephone')}/>
        </div>
    );
}

const ShippingDetails = ({shippingMethod,setShippingPrice}) => {
    const { t } = useTranslation();
    const [wilayas, setWilayas] = React.useState([]);
    const [selectedWilayaId,setselectedWilayaId] = useState("");
    const [communes, setCommunes] = React.useState([]);
    const [selectedCommuneId,setselectedCommuneId] = useState("");
    const [agences, setAgences] = React.useState([]);
    const [selectedAgenceId,setselectedAgenceId] = useState("");
    const [address,setAddress] = useState("");
    const [agenceAddress,setAgenceAddress] = useState("");
    const [gps,setGps] = useState("");
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
            // console.log(data);
            setWilayas(data.wilayas);
            //setselectedWilayaId("1");
        }

        getWilayas();
    },[])
    //fetch communes
    useEffect(()=>{
        async function getCommunes() {
            let url = `yalidine/communes/${selectedWilayaId}`
            if(shippingMethod == "stopDesk"){
                url = `yalidine/communes/${selectedWilayaId}/hasAgence`
            }
            const result = await fetch(settings.Api + url);
            if(!result.ok){
                return console.error("Failed to fetch communes");
            }

            const data = await result.json();
            // console.log(data);
            setCommunes(data.communes);
            //setselectedCommuneId("1");
        }

        if (selectedWilayaId){
          getCommunes();
          const selectedWilaya = wilayas.find((w)=>w.id == selectedWilayaId);
          const shippingTarif = shippingMethod == "stopDesk" ? selectedWilaya.stopDeskTarif : selectedWilaya.homeTarif;
          // console.log(shippingTarif);
          setShippingPrice(shippingTarif);
        } 
        setselectedAgenceId("");

    },[selectedWilayaId,shippingMethod])
    //fetch agences
    useEffect(()=>{
        async function getAgences() {
            let url = `yalidine/agences/${selectedCommuneId}`
            
            const result = await fetch(settings.Api + url);
            if(!result.ok){
                return console.error("Failed to fetch agences");
            }

            const data = await result.json();
            // console.log(data);
            setAgences(data.agences);
            //setselectedCommuneId("1");
        }

        if (shippingMethod == "stopDesk" && selectedCommuneId){
          getAgences();
          setselectedAgenceId("");
        }


    },[selectedCommuneId])

    useEffect(()=>{
        const agence = agences.find((a)=>a.id == selectedAgenceId);
        setAgenceAddress(agence?.address);
        setGps(agence?.gps);
        //console.log(agence);
        //setAddress(selectedAgenceId.address);
      
    },[selectedAgenceId])

    return(
        <div className='flex flex-col gap-4 bg-white rounded-lg w-full'>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t('willaya')}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedWilayaId}
                onChange={(e)=> setselectedWilayaId(e.target.value)}
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
          <MenuItem key={w.id} value={w.id}>
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
                value={selectedCommuneId}
                onChange={(e)=> setselectedCommuneId(e.target.value)}
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
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
            </Select>
            </FormControl>
            {
              shippingMethod == "stopDesk" ?
              <div>
              <div className='flex'>   
              <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">{t('agence')}</InputLabel>
              <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedAgenceId}
                  onChange={(e)=> setselectedAgenceId(e.target.value)}
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
            <MenuItem key={a.id} value={a.id}>
              {a.name}
            </MenuItem>
          ))}
              </Select>
              </FormControl>

              {selectedAgenceId != "" && <IconButton color="primary" aria-label="Agencer location" 
                style={{ padding: '0px'}} onClick={ShowLocation}
>
                <LocationOnIcon fontSize='large'/>
              </IconButton>}
              </div>
               {selectedAgenceId != "" && <p>Address: {agenceAddress}</p>}
              </div>
            :
              <TextField id="outlined" value={address} onChange={(e)=> setAddress(e.target.value)} label={t('address')}/>
            }
        </div>
    );
}

const ShippingMethod = ({shippingMethod,setShippingMethod}) => {
    const { t } = useTranslation();
    const handleChange = (e)=>{
        if(e.target.value == "stopDesk") setShippingMethod("stopDesk");
        else setShippingMethod("home");
    }

    return(
        <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">{t('deliveryMethod')}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        defaultValue='stopDesk'
        value={shippingMethod}
        onChange={handleChange}
      >
        <FormControlLabel value='stopDesk' control={<Radio />} label={t('pickupPointDelivery')} />
        <FormControlLabel value='home' control={<Radio />} label={t('homeDelivery')} />
      </RadioGroup>
    </FormControl>
    );
}

const ShippingForm = () => {
    const {t} = useTranslation();
    const [shippingMethod,setShippingMethod] = useState("stopDesk");
    const [shippingPrice,setShippingPrice] = useState(0);
  return (
    <div className='w-full flex flex-col md:flex-row h-auto gap-4'>
        <div className='flex flex-col bg-white rounded-lg w-full p-4 '>
          <h3 className="font-medium text-xl mb-4 text-dark">{t('orderAndDeliveryDetails')}</h3>
            <ShippingMethod shippingMethod={shippingMethod} setShippingMethod={setShippingMethod}/>
            <div className='flex md:flex-row flex-col gap-4 mt-2'>
                <CustomerInformation />
                <ShippingDetails shippingMethod={shippingMethod} setShippingPrice={setShippingPrice}/>
            </div>
        </div>
        <OrderSummary ShippingFees={shippingPrice}/>
    </div>
  )
}

export default ShippingForm
