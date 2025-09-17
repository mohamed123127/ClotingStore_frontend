export type orderInfo = {
    customerInfo ,
    shippingDetaillies
}

export type customerInfo = {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        website:string;
    }

export type shippingDetaillies = {
        shippingMethod: string;
        wilayaName: string;
        communeName: string;
        agenceId: string
        address: string; 
    }

export type soldItem= {
    variantId: number;
    sellingPrice: number;
    quantity: number;
}