import React from 'react'
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

const CustomerInformation = () => {
    const { t } = useTranslation();
    return(
        <div className='flex flex-col gap-4 bg-white rounded-lg w-full'>
            <TextField id="outlined" label={t('nom')}/>
            <TextField id="outlined" label={t('prenom')}/>
            <TextField id="outlined" label={t('numeroTelephone')}/>
        </div>
    );
}

const ShippingDetails = () => {
    const { t } = useTranslation();
    const [age, setAge] = React.useState(['ine', 'deux', 'trois']);
    return(
        <div className='flex flex-col gap-4 bg-white rounded-lg w-full'>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t('willaya')}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label={t('willaya')}
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            </FormControl>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t('commune')}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label={t('commune')}
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            </FormControl>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t('agence')}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label={t('agence')}
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            </FormControl>
        </div>
    );
}

const ShippingMethod = () => {
    const { t } = useTranslation();
    return(
        <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">{t('deliveryMethod')}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        defaultValue='StopDesk'
      >
        <FormControlLabel value='StopDesk' control={<Radio />} label={t('pickupPointDelivery')} />
        <FormControlLabel value='Home' control={<Radio />} label={t('homeDelivery')} />
      </RadioGroup>
    </FormControl>
    );
}

const ShippingForm = () => {
    const {t} = useTranslation();
  return (
    <div className='w-full flex flex-col md:flex-row h-auto gap-4'>
        <div className='flex flex-col bg-white rounded-lg w-full p-4 '>
          <h3 className="font-medium text-xl mb-4 text-dark">{t('orderAndDeliveryDetails')}</h3>
            <ShippingMethod />
            <div className='flex md:flex-row flex-col gap-4 mt-2'>
                <CustomerInformation />
                <ShippingDetails />
            </div>
        </div>
        <OrderSummary ShippingFees={500}/>
    </div>
  )
}

export default ShippingForm
