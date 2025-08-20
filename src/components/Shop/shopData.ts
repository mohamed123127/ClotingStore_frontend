import { Product } from "@/types/product";
import settings from "../../../settings.json";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(settings.Api + "products");
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  const products = data.products;

  return products.map((p: any) : Product => ({
    title: p.name,
    description: p.description,
    reviews: 0,
    price: p.price,
    discountedPrice: null,
    id: p.id, 
    previewImage : p.preview_image
  }));
}

const shopData: Product[] = [
  {
    title: "Havit HV-G69 USB Gamepad",
    description: "",
    reviews: 15,
    price: 59.0,
    discountedPrice: 29.0,
    id: 1,
    previewImage: "/images/products/product-1-sm-1.png",
  },
  {
    title: "iPhone 14 Plus , 6/128GB",
    description: "",
    reviews: 5,
    price: 899.0,
    discountedPrice: 99.0,
    id: 2,
    previewImage: "/images/products/product-2-sm-1.png",
  }
];
export default shopData;
