import { Product } from "@/types/product";
import settings from "../../../settings.json";

export let totalProducts = 0;
export let totalPages = 0;

export async function getProducts(pageNumber,perPage): Promise<Product[]> {
  const response = await fetch(settings.Api + "products?page=" + pageNumber + "&per_page=" + perPage);
  // console.log(response);
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  //console.log(data);
  const products = data.products;
  totalProducts = data.total_products;
  totalPages = data.last_page;
  //console.log(data.products);
  return products.map((p: any) : Product => ({
    id: p.id, 
    name: p.name,
    description: p.description,
    price: p.price,
    discountedPrice: null,
    sex: p.sex,
    previewImage : p.preview_image
  }));
}

const shopData: Product[] = [
  {
    name: "Havit HV-G69 USB Gamepad",
    description: "",
    price: 59.0,
    discountedPrice: 29.0,
    id: 1,
    previewImage: "/images/products/product-1-sm-1.png",
  },
  {
    name: "iPhone 14 Plus , 6/128GB",
    description: "",
    price: 899.0,
    discountedPrice: 99.0,
    id: 2,
    previewImage: "/images/products/product-2-sm-1.png",
  }
];
export default shopData;
