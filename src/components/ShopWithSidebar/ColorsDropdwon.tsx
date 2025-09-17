"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

const ColorsDropdwon = () => {
   const [toggleDropdown, setToggleDropdown] = useState(true);
  const [activeColor, setActiveColor] = useState("blue");
  const [colors,setColors] = useState<string[]>([]);
    const { t } = useTranslation();

  //const colorss = ["red", "blue", "orange", "pink", "purple"];

useEffect(()=>{
    async function fetchColors(){
      const result = await fetch(process.env.NEXT_PUBLIC_Default_Api_Url + "variants/colors");
      if(!result.ok){
        return console.error("Failed to fetch sizes");
      }
      
      const data = await result.json();
       let filteredColors = [];

data.colors.forEach(color => {
  if (color.includes("-")) {
    // اللون مركب
    const parts = color.split("-");
    parts.forEach(part => {
      if (!filteredColors.includes(part)) {
        filteredColors.push(part); // أضف فقط إذا لم يكن موجودًا
      }
    });
  } else {
    if (!filteredColors.includes(color)) {
      filteredColors.push(color); // أضف اللون إذا لم يكن موجودًا
    }
  }
});
      setColors(filteredColors);
    }

    fetchColors();
    //setSizes(["XS","S","M","L","XL","XXL"])
  },[])

    useEffect(()=>{
      setActiveColor(colors[0]);
    },[])

    function isValidCssColor(color: string): boolean {
  const s = new Option().style;
  s.color = color;
  return s.color !== "";
}

function renderCustomComponent(color: string) {
  switch (color.toLowerCase()) {
    // case "pink-white":
    //   return (
    // <div
    //   className="w-6 h-6 rounded-full border-[#ccc]"
    //   style={{
    //     backgroundImage:
    //       "linear-gradient(to right, pink 50%, white 50%)",
    //   }}
    // />      );
    // case "white-purple":
    //   return (
    // <div
    //   className="w-6 h-6 rounded-full border-2 border-[#ccc]"
    //   style={{
    //     backgroundImage:
    //       "linear-gradient(to right, white 50%, purple 50%)",
    //   }
    // }
    // />      );
    case "biker":
      return (
    <div
      className="w-6 h-6 rounded-full bg-[#918072]"
    />      );
    default:
      return (
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-300">
          ?
        </div>
      );
  }
}

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown && "shadow-filter"
        }`}
      >
        <p className="text-dark">{t('Colors')}</p>
        <button
          aria-label="button for colors dropdown"
          className={`text-dark ease-out duration-200 ${
            toggleDropdown && "rotate-180"
          }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      {/* <!-- dropdown menu --> */}
      <div
  className={`flex-wrap gap-2.5 p-6 ${
    toggleDropdown ? "flex" : "hidden"
  }`}
>
  {colors.map((color, key) => (
    <label
      key={key}
      htmlFor={color}
      className="cursor-pointer select-none flex items-center"
    >
      <div className="relative group">
        <input
          type="radio"
          name="color"
          id={color}
          className="sr-only"
          onChange={() => setActiveColor(color)}
        />
        <div className="flex items-center justify-center w-8 h-8 rounded-full">
        {isValidCssColor(color) ? (
          <span
            className="block w-6 h-6 rounded-full"
            style={{
              backgroundColor: color,
              border:
["white", "beige"].includes(color.toLowerCase())
  ? "2px solid #ccc"
  : "none"
            }}
          ></span>
        ) : (
          renderCustomComponent(color) // 👈 هنا ال fallback
        )}
      </div>

        {/* Tooltip */}
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs bg-black text-blue-dark px-2 py-1 rounded-md hidden group-hover:block whitespace-nowrap" dir="ltr">
          {color}
        </span>
      </div>
    </label>
  ))}
</div>

    </div>
  );
};

export default ColorsDropdwon;
