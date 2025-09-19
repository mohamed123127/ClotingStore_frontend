// GenderDropdown.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

const GenderItem = ({ gender, count, selectedGenders, setSelectedGenders }) => {
  const { t } = useTranslation();

  return (
    <button
      className={`${
        selectedGenders.includes(gender) && "text-blue"
      } group flex items-center justify-between ease-out duration-200 hover:text-blue `}
      onClick={() =>
        setSelectedGenders(prev => {
          if (prev.includes(gender)) {
            return prev.filter(g => g !== gender); // إزالة
          } else {
            return [...prev, gender]; // إضافة
          }
        })
      }
    >
      <div className="flex items-center gap-2">
        <div
          className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${
            selectedGenders.includes(gender)
              ? "border-blue bg-blue"
              : "bg-white border-gray-3"
          }`}
        >
          <svg
            className={selectedGenders.includes(gender) ? "block" : "hidden"}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
              stroke="white"
              strokeWidth="1.94437"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span>{t(gender)}</span>
      </div>

      <span
        className={`${
          selectedGenders.includes(gender) ? "text-white bg-blue" : "bg-gray-2"
        } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
      >
        {count}
      </span>
    </button>
  );
};

const GenderDropdown = ({ setFillter , resetFillterSignal }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [genders, setGenders] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const { t } = useTranslation();

   useEffect(()=>{
    setSelectedGenders([]);
  },[resetFillterSignal])

  useEffect(() => {
    async function fetchGenders() {
      const result = await fetch(
        process.env.NEXT_PUBLIC_Default_Api_Url + "products/genders"
      );
      if (!result.ok) {
        return console.error("Failed to fetch genders");
      }

      const data = await result.json();
      setGenders(data.genders);
    }

    fetchGenders();
  }, []);

  // تحديث الفلتر حسب التحديد
  useEffect(() => {
    if (selectedGenders.length > 0) {
      setFillter(prev => ({
        ...prev,
        sex: selectedGenders.join(","),
      }));
    } else {
      setFillter(prev => {
        const updated = { ...prev };
        delete updated.sex;
        return updated;
      });
    }
  }, [selectedGenders]);

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown && "shadow-filter"
        }`}
      >
        <p className="text-dark">{t("Gender")}</p>
      </div>

      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        {genders.map((gender, key) => (
          <GenderItem
            key={key}
            gender={gender.name}
            count={gender.count}
            selectedGenders={selectedGenders}
            setSelectedGenders={setSelectedGenders}
          />
        ))}
      </div>
    </div>
  );
};

export default GenderDropdown;
