'use client'

import * as React from 'react'
import { SalesTable } from '@/components/Dashboard/SalesTable';

// const sales: Sale[] = [
//   {
//     id: "yal-W95NXT",
//     fullName: "khalouch jalil",
//     status: "En préparation",
//     communeAndWillaya: "Adrar, Adrar",
//     "agence/address": "Agence de Adrar Yalidine",
//     phoneNumber: "0558789654",
//     totalPrice: 900,
//     "updated at": "2025-09-13T12:50:53.000000Z",
//     saledItems: [
//       { product: "Imad", color: "Marron", size: "1-2", selling_price: "3800.00", quantity: 0 },
//       { product: "Chahin", color: "Bleu", size: "4-5", selling_price: "4200.00", quantity: 0 }
//     ]
//   },
//   {
//     id: "yal-X79ANE",
//     fullName: "louahchi mohamed",
//     status: "En préparation",
//     communeAndWillaya: "Khemis Miliana, Aïn Defla",
//     "agence/address": "Agence de Khemis Miliana Guepex",
//     phoneNumber: "0554875632",
//     totalPrice: 4500,
//     "updated at": "2025-09-13T12:53:09.000000Z",
//     saledItems: [
//       { product: "Adem", color: "Blanc", size: "1-2", selling_price: "4000.00", quantity: 1 }
//     ]
//   }
// ]


export default function Dashboard() {
    const [sales,setSales] = React.useState([]);
    const ApiUrl = process.env.NEXT_PUBLIC_Default_Api_Url;

    React.useEffect(()=>{
        async function getAllSales() {
        const result = await fetch(ApiUrl + "sales");
        if(!result.ok){
            return console.error("Failed to fetch sa;es");
        }

        const data = await result.json();
        console.log(data);
      setSales(data.sales);
        }

        getAllSales();
    },[])
  return <SalesTable sales={sales} />
}
