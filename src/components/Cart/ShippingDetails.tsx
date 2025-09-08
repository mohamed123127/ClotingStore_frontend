import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { shippingDetaillies } from "@/types/orderInfo";
import { setShippingDetaillies } from "@/redux/features/order-slice";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import LocationOnIcon from '@mui/icons-material/LocationOn'; 
import settings from "../../../settings.json";

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
            const selectedWilaya = wilayas.find((w)=>w.name == shippingDetaillies.wilayaName)
            // console.info(selectedWilaya);
            let url = `yalidine/communes/${selectedWilaya.id}`
            if(shippingDetaillies.shippingMethod == "stopDesk"){
                url = `yalidine/communes/${selectedWilaya.id}/hasAgence`
            }
            const result = await fetch(settings.Api + url);
            if(!result.ok){
                return console.error("Failed to fetch communes");
            }

            const data = await result.json();
            // console.log(data);
            setCommunes(data.communes);
            // console.info(shippingDetaillies.wilayaName);
            //console.info(shippingDetaillies.commune);

            //setSelectedCommune("1");
        }
        // console.info(shippingDetaillies.wilayaName);
        if (shippingDetaillies.wilayaName != "")
          {
          getCommunes();
          const shippingFees = wilayas.find((w) => w.name === shippingDetaillies.wilayaName);
          setShippingFees(shippingDetaillies.shippingMethod == "stopDesk" ? shippingFees?.stopDeskTarif : shippingFees?.homeTarif);
        } 
          dispatch(setShippingDetaillies({...shippingDetaillies,agenceId:""}))

    },[shippingDetaillies.wilayaName,shippingDetaillies.shippingMethod])
    //fetch agences
    useEffect(()=>{
        async function getAgences() {
            //console.info(shippingDetaillies.commune);
            const selectedCommune = communes.find((c)=>c.name == shippingDetaillies.communeName)
            let url = `yalidine/agences/${selectedCommune.id}`
            
            const result = await fetch(settings.Api + url);
            if(!result.ok){
                return console.error("Failed to fetch agences");
            }

            const data = await result.json();
            // console.log(data);
            setAgences(data.agences);
            //setselectedCommuneId("1");
        }

        if (shippingDetaillies.shippingMethod == "stopDesk" && shippingDetaillies.communeName != ""){
          getAgences();
          //setSelectedAgence("");
          dispatch(setShippingDetaillies({...shippingDetaillies,agenceId:""}))
        }


    },[shippingDetaillies.communeName])

    useEffect(()=>{
        const agence = agences.find((a)=>a.id == shippingDetaillies.agenceId);
        //console.log(agences,shippingDetaillies);
        setAgenceAddress(agence?.address);
        setGps(agence?.gps);
        //console.log(agence);
        //setAddress(selectedAgenceId.address);
      
    },[shippingDetaillies.agenceId])

    return(
        <div className='flex flex-col gap-4 bg-white rounded-lg w-full'>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t('willaya')}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={shippingDetaillies.wilayaName}
                onChange={(e)=> {
                  dispatch(setShippingDetaillies({
                    ...shippingDetaillies,
                    wilayaName: e.target.value
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
          <MenuItem key={w.id} value={w.name}>
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
                value={shippingDetaillies.communeName}
                onChange={(e)=> {
                  //console.info(e.target.value);
                  dispatch(setShippingDetaillies({
                    ...shippingDetaillies,
                    communeName: e.target.value
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
          <MenuItem key={c.id} value={c.name}>
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
                  value={shippingDetaillies.agenceId}
                  onChange={(e)=> {
                  dispatch(setShippingDetaillies({
                    ...shippingDetaillies,
                    agenceId: e.target.value
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
            <MenuItem key={a.id} value={a.id}>
              {a.name}
            </MenuItem>
          ))}
              </Select>
              </FormControl>

              {shippingDetaillies.agenceId != "" && <IconButton color="primary" aria-label="Agencer location" 
                style={{ padding: '0px'}} onClick={ShowLocation}>
                <LocationOnIcon fontSize='large'/>
              </IconButton>}
              </div>
               {shippingDetaillies.agenceId != "" && <p>Address: {agenceAddress}</p>}
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

export default ShippingDetails
