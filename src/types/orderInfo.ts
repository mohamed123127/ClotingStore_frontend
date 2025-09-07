export type orderInfo = {
    customerInfo ,
    shippingDetaillies
}

export type customerInfo = {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    }

export type shippingDetaillies = {
        shippingMethod: string;
        wilaya: {
            id: number;
            name: string;
        };
        commune: {
            id: number;
            name: string;
        };
        agence: {
            id: number;
            name: string;
        };
        address: string; 
    }

export type soldItem= {
    variantId: number;
    sellingPrice: number;
    quantity: number;
}