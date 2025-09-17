import { customerInfo, orderInfo, shippingDetaillies } from "@/types/orderInfo";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState:orderInfo = {
    customerInfo:{
        firstName:"",
        lastName:"",
        phoneNumber:"",
        website: ""
    },
    shippingDetaillies:{
        shippingMethod:"stopDesk",
        wilayaName : "",
        communeName : "",
        agenceId : "",
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
            state.customerInfo.website = action.payload.website;
        },
        setShippingDetaillies: (state,action:PayloadAction<shippingDetaillies>) => {
            state.shippingDetaillies.shippingMethod = action.payload.shippingMethod;
            state.shippingDetaillies.wilayaName = action.payload.wilayaName;
            state.shippingDetaillies.communeName = action.payload.communeName;
            state.shippingDetaillies.agenceId = action.payload.agenceId;
            state.shippingDetaillies.address = action.payload.address;
        },
        clearOrderInfo: (state) => {
            state.customerInfo = initialState.customerInfo;
            state.shippingDetaillies = initialState.shippingDetaillies;
        }
    }
});

export const {setCustomerInfo,setShippingDetaillies,clearOrderInfo} = orderInfoSlice.actions;
export default orderInfoSlice.reducer;