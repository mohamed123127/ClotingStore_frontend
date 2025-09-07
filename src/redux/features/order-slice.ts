import { customerInfo, orderInfo, shippingDetaillies } from "@/types/orderInfo";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState:orderInfo = {
    customerInfo:{
        firstName:"",
        lastName:"",
        phoneNumber:""
    },
    shippingDetaillies:{
        shippingMethod:"stopDesk",
        wilaya: {
            id:null,
            name:""
        },
        commune: {
            id:null,
            name:""
        },
        agence: {
            id: null,
            name: ""
        },
        address:""
    }
};

const orderInfoSlice = createSlice({
    name: "orderInfo",
    initialState,
    reducers: {
        setCustomerInfo: (state,action:PayloadAction<customerInfo>) => {
            state.customerInfo.firstName = action.payload.firstName;
            state.customerInfo.lastName = action.payload.lastName;
            state.customerInfo.phoneNumber = action.payload.phoneNumber;
        },
        setShippingDetaillies: (state,action:PayloadAction<shippingDetaillies>) => {
            state.shippingDetaillies.shippingMethod = action.payload.shippingMethod;
            state.shippingDetaillies.wilaya = action.payload.wilaya;
            state.shippingDetaillies.commune = action.payload.commune;
            state.shippingDetaillies.agence = action.payload.agence;
            state.shippingDetaillies.address = action.payload.address;
        },
        clearOrderInfo: (state) => {
            state = initialState;
        }
    }
});

export const {setCustomerInfo,setShippingDetaillies,clearOrderInfo} = orderInfoSlice.actions;
export default orderInfoSlice.reducer;