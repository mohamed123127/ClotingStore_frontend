import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import Cookies from 'js-cookie';

type InitialState = {
  items: CartItem[];
};

type CartItem = {
  id: number;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  availableQuantity?: number;
  image: string;
};

const initialState: InitialState = {
  items: Cookies.get("parcelItems") ? JSON.parse(Cookies.get('parcelItems')) : [] ,
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, name,color,size, price, quantity,availableQuantity, image } =
        action.payload;
      const existingItem = state.items.find((item) => item.id === id && item.color === color && item.size === size);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          name,
          color,
          size,
          price,
          quantity,
          availableQuantity,
          image,
        });
        Cookies.set('parcelItems', JSON.stringify(state.items));
        // console.info(state.items);
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      Cookies.set('parcelItems', JSON.stringify(state.items));
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
      Cookies.set('parcelItems', JSON.stringify(state.items));
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
      Cookies.remove('parcelItems');
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
} = cart.actions;
export default cart.reducer;
