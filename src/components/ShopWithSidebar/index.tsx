"use client";
import React, { useState, useEffect, use } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import GenderDropdown from "./GenderDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";
import {getProducts,totalProducts,totalPages} from "../Shop/shopData";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { Product } from "@/types/product";
import { useAppSelector } from "@/redux/store";
import { Category } from "@/types/category";
import { useTranslation } from "react-i18next";


const ShopWithSidebar = () => {
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [shopData, setShopData] = useState<Product[]>([]);
  const [filltredProducts,setFilltredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [paginationInfo,setPaginationInfo] = useState({currentPage:1,perPage:12,totalPages:10});
  const categories = useAppSelector((state) => state.categoriesSlice.list) as Category[];
  const { t } = useTranslation();

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  // const options = [
  //   { label: "Latest Products", value: "0" },
  //   { label: "Best Selling", value: "1" },
  //   { label: "Old Products", value: "2" },
  // ];

  // const categories = [
  //   {
  //     name: "Desktop",
  //     products: 10,
  //     isRefined: true,
  //   },
  //   {
  //     name: "Laptop",
  //     products: 12,
  //     isRefined: false,
  //   },
  //   {
  //     name: "Monitor",
  //     products: 30,
  //     isRefined: false,
  //   },
  //   {
  //     name: "UPS",
  //     products: 23,
  //     isRefined: false,
  //   },
  //   {
  //     name: "Phone",
  //     products: 10,
  //     isRefined: false,
  //   },
  //   {
  //     name: "Watch",
  //     products: 13,
  //     isRefined: false,
  //   },
  // ];

  const genders = shopData.reduce((acc, item) => {
  acc[item.sex] = (acc[item.sex] || 0) + 1;
  return acc;
}, {});

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    // closing sidebar while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    getProducts(paginationInfo.currentPage,paginationInfo.perPage)
      .then((data) => {
        setShopData(data);
        paginationInfo.totalPages = totalPages;
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getProducts(paginationInfo.currentPage,paginationInfo.perPage)
    .then((data) => {
        setShopData(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  },[paginationInfo.currentPage])

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Breadcrumb
        title={"ExploreAllProducts"}
        pages={["Shop"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
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
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                    fill=""
                  />
                </svg>
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* <!-- filter box --> */}
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p>{t('Filters')}:</p>
                      <button className="text-blue">{t('CleanAll')}</button>
                    </div>
                  </div>

                  {/* <!-- category box --> */}
                  <CategoryDropdown categories={categories} />

                  {/* <!-- gender box --> */}
                  <GenderDropdown />

                  {/* // <!-- size box --> */}
                  <SizeDropdown />

                  {/* // <!-- color box --> */}
                  <ColorsDropdwon />

                  {/* // <!-- price range box --> */}
                  <PriceDropdown />
                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">

              {/* <!-- Products Grid Tab Content Start --> */}
              <div
                className={`${
                  productStyle === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"
                    : "flex flex-col gap-7.5"
                }`}
              >
                {shopData.map((item, key) =>
                  productStyle === "grid" ? (
                    <SingleGridItem item={item} key={key} />
                  ) : (
                    <SingleListItem item={item} key={key} />
                  )
                )}
              </div>
              {/* <!-- Products Grid Tab Content End --> */}

              {/* <!-- Products Pagination Start --> */}
              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2">
                  <ul className="flex items-center">
                    <li>
                      <button
                        id="paginationLeft"
                        aria-label="button for pagination left"
                        type="button"
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px disabled:text-gray-4"
                        disabled={paginationInfo.currentPage === 1}
                        onClick={()=>{
                          if(paginationInfo.currentPage > 1){
                            setPaginationInfo((prev)=>({...prev, currentPage: prev.currentPage - 1}))
                          }
                        }}
                      >
                        <svg
                          className="fill-current rtl:rotate-180"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.1782 16.1156C12.0095 16.1156 11.8407 16.0594 11.7282 15.9187L5.37197 9.45C5.11885 9.19687 5.11885 8.80312 5.37197 8.55L11.7282 2.08125C11.9813 1.82812 12.3751 1.82812 12.6282 2.08125C12.8813 2.33437 12.8813 2.72812 12.6282 2.98125L6.72197 9L12.6563 15.0187C12.9095 15.2719 12.9095 15.6656 12.6563 15.9187C12.4876 16.0312 12.347 16.1156 12.1782 16.1156Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </li>
                    {Array.from(
                      { length: paginationInfo.totalPages > 3 ? 3 : paginationInfo.totalPages },
                      (_, i) => (
                        <li key={i+1}>
                      <a
                        href="#"
                        className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue-light ${paginationInfo.currentPage === i+1 ? 'text-white bg-blue' : ''}`}
                        onClick={()=>setPaginationInfo({...paginationInfo, currentPage: i+1})}
                      >
                        {i+1}
                      </a>
                    </li>
                      )
                    )}
                    

                    <li className={`${paginationInfo.totalPages > 4 ? '' : 'hidden'}`}>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue"
                      >
                        ...
                      </a>
                    </li>

                    <li className={`${paginationInfo.totalPages > 3 ? '' : 'hidden'}`}>
                      <a
                        href="#"
                        className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] hover:text-white hover:bg-blue ${paginationInfo.currentPage === paginationInfo.totalPages ? 'text-white bg-blue' : ''}`}
                        onClick={()=>setPaginationInfo({...paginationInfo, currentPage: paginationInfo.totalPages})}
                      >
                        {paginationInfo.totalPages}
                      </a>
                    </li>

                    <li>
                      <button
                        id="paginationLeft"
                        aria-label="button for pagination left"
                        type="button"
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4"
                        disabled={paginationInfo.currentPage === paginationInfo.totalPages}
                        onClick={()=>{
                            if(paginationInfo.currentPage < paginationInfo.totalPages){
                              setPaginationInfo((prev)=>({...prev, currentPage: prev.currentPage + 1}))
                            }
                          }}
                      >
                        <svg
                          className={`fill-current rtl:rotate-180`}
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.82197 16.1156C5.65322 16.1156 5.5126 16.0594 5.37197 15.9469C5.11885 15.6937 5.11885 15.3 5.37197 15.0469L11.2782 9L5.37197 2.98125C5.11885 2.72812 5.11885 2.33437 5.37197 2.08125C5.6251 1.82812 6.01885 1.82812 6.27197 2.08125L12.6282 8.55C12.8813 8.80312 12.8813 9.19687 12.6282 9.45L6.27197 15.9187C6.15947 16.0312 5.99072 16.1156 5.82197 16.1156Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              {/* <!-- Products Pagination End --> */}
            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
