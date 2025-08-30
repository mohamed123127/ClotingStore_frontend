import settings from "../../../../settings.json";

export async function getCategories() {
  const response = await fetch(settings.Api + "categories");
  console.log(response);
  if (!response.ok) throw new Error("Failed to fetch categories");
  const data = await response.json();
  return data.Categories;
}

const data = [
  {
    title: "Boys",
    id: 1,
    img: "/images/categories/boy.png",
  },
  {
    title: "Girls",
    id: 2,
    img: "/images/categories/girl.png",
  },
  {
    title: "TwoItems",
    id: 3,
    img: "/images/categories/twoItem.png",
  },
  {
    title: "ThreeItems",
    id: 4,
    img: "/images/categories/3item.png",
  }
];

export default data;
