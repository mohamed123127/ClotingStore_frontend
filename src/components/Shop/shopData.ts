import { Product } from "@/types/product";
export let totalProducts = 0;
export let totalPages = 0;

function generateFillter(filters: productFillter): string {
  const keys = Object.keys(filters);
  if (keys.length > 0) {
    let filter = "";
    keys.forEach(key => {
      filter += `&${key}=${filters[key]}`;
    });

    return filter;
  }

  return "";
}

export async function getProducts(pageNumber,perPage,fillters): Promise<Product[]> {
  const fillter= generateFillter(fillters);
  const path = "products";
  const params = new URLSearchParams({
    page: pageNumber,
    per_page: perPage
  });
  console.log(process.env.NEXT_PUBLIC_Default_Api_Url + `${encodeURIComponent(path)}&${params.toString()}` +fillter);
  const response = await fetch(process.env.NEXT_PUBLIC_Default_Api_Url + `${encodeURIComponent(path)}&${params.toString()}` +fillter);
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();

  const products = data.products;
  totalProducts = data.total_products;
  totalPages = data.last_page;
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
    sex:"H"
  },
  {
    name: "iPhone 14 Plus , 6/128GB",
    description: "",
    price: 899.0,
    discountedPrice: 99.0,
    id: 2,
    previewImage: "/images/products/product-2-sm-1.png",
    sex:"F"
  }
];
export default shopData;
