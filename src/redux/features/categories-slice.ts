import { createSlice ,createAsyncThunk  } from "@reduxjs/toolkit";
import { Category } from "@/types/category";
import { initScriptLoader } from "next/script";

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async ()=> {
    const response = await fetch(process.env.NEXT_PUBLIC_Default_Api_Url + "categories");
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    return data.Categories;
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.list = action.payload.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        productsCount: cat.products_count, // التحويل
      }));
    });
  },
});

export default categoriesSlice.reducer;