
export async function getCategories() {
  const ApiUrl = process.env.NEXT_PUBLIC_Default_Api_Url;
  
  const response = await fetch(ApiUrl + "categories");
  console.log(response);
  if (!response.ok) throw new Error("Failed to fetch categories");
  const data = await response.json();
  return data.Categories;
}

const data = [
  {
    name: "Boys",
    id: 1,
    img: "/images/categories/boy.png",
  },
  {
    name: "Girls",
    id: 2,
    img: "/images/categories/girl.png",
  },
  {
    name: "TwoItems",
    id: 3,
    img: "/images/categories/twoItem.png",
  },
  {
    name: "ThreeItems",
    id: 4,
    img: "/images/categories/3item.png",
  }
];

export default data;
