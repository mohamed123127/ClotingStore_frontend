"use client";
import React, { use, useEffect, useState } from "react";

import { useModalContext } from "@/app/context/QuickViewModalContext";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { resetQuickView } from "@/redux/features/quickView-slice";
import { productDetails, updateproductDetails } from "@/redux/features/product-details";
import ExtractWithoutRepetition from "@/helpers/Extractor";
import { getProducts } from "../Shop/shopData";
import { get } from "node:http";
import { prototype } from "node:events";
import PreLoader from "@/components/Common/PreLoader";
import { useTranslation } from "next-i18next";
import { size } from "zod";

const QuickViewModal = () => {
   const { isModalOpen, closeModal } = useModalContext();
   const {t} = useTranslation();
  const {openPreviewModal } = usePreviewSlider();
  const [loading, setLoading] = useState({
    colors: true,
    sizes: true,
    images: true
  });
  const [productWithDetailles,setProductWithDetailles] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [selectedVariant,setSelectedVariant] = useState<any>([]);
  const [previewImageIndex,setPreviewImageIndex] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const carteItems = useAppSelector((state)=>state.cartReducer.items);
  // get the product data
  const product = useAppSelector((state) => state.quickViewReducer.value);
  const [activePreview, setActivePreview] = useState(product?.previewImage);
  const isAllLoaded = !loading.colors && !loading.sizes && !loading.images;
  const [selectedVariantQuantityInCart,setSelectedVariantQuantityInCart] = useState(0);
  const [productMesurements,setProductMesurements] = useState([]);
  const [selectedItemMesurements,setSelectedItemMesurements] = useState(null);
  // preview modal
  const zoomCurrentPreviewImage = () => {
    dispatch(updateproductDetails(product));

    openPreviewModal(previewImageIndex,productWithDetailles.images);
  };

  // add to cart
  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...productWithDetailles,
        id:selectedVariant.id,
        price:parseInt(productWithDetailles.price.replace(/[,]/g, ''),10),
        color:selectedVariant.color,
        size:selectedVariant.size,
        availableQuantity:selectedVariant.quantity,
        image:productWithDetailles.previewImage,
        quantity,
      })
    );

    closeModal();
  };

  //to close model
  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        setLoading({sizes:true,colors:true,images:true});
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      setQuantity(1);
    };
  }, [isModalOpen, closeModal]);
  
  //to load product detaillies
  useEffect(() => {
    setProductWithDetailles({...product});
    async function getProductVariants() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_Default_Api_Url}products/${product.id}/variants`);
  
        if (!response.ok) {
          console.error("Failed to fetch variants:", response.status);
          return; 
        }
  
        const jsonResponse = await response.json();
  
        if (!Array.isArray(jsonResponse.data)) {
          console.error("API did not return a variants array:", jsonResponse);
          // alert("this product is out of stock");
          // closeModal();
          return;
        }
        const variants = jsonResponse.data;
        setProductWithDetailles((prev)=>({...prev,variants}));
        //console.log(variants);
        setSelectedVariant(variants[0]);
        const quantityInCart = carteItems.find(item => item.id == variants[0].id)?.quantity ?? 0;
        //console.log("selectedVariant",variants[0]);
        setSelectedVariantQuantityInCart(quantityInCart);

      } catch (error) {
        console.error("Error fetching variants:", error);
      }
    }

    async function getProductSizes() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_Default_Api_Url}products/${product.id}/sizes`);
  
        if (!response.ok) {
          console.error("Failed to fetch sizes:", response.status);
          return; 
        }
  
        const jsonResponse = await response.json();
  
        if (!Array.isArray(jsonResponse.sizes)) {
          console.error("API did not return a sizes array:", jsonResponse);
          // alert("this product is out of stock");
          // closeModal();
          return;
        }
        setProductMesurements(jsonResponse.sizes);
        // console.log(jsonResponse.sizes);
        const sizes = ExtractWithoutRepetition(jsonResponse.sizes,"size");
        setProductWithDetailles((prev)=>({...prev,sizes}));
        // console.log(jsonResponse.sizes);
        if(selectedVariant){
          const selectedSize = jsonResponse.sizes.find((size)=>(size.size == selectedVariant.size))
          if(selectedSize?.mesurements.length == 3){
            setSelectedItemMesurements({
              size:selectedVariant.size,
              shirtLength: selectedSize.mesurements[0].value,
              sleeveLength: selectedSize.mesurements[1].value,
              pantsLength: selectedSize.mesurements[2].value
            });
            // console.log(selectedSize.mesurements);
          }else if(selectedSize?.mesurements.length == 5){
              setSelectedItemMesurements({
              size:selectedVariant.size,
              shirtLength: selectedSize.mesurements[0].value,
              sleeveLength: selectedSize.mesurements[1].value,
              jacketLength: selectedSize.mesurements[2].value,
              jacketSleeveLength: selectedSize.mesurements[3].value,
              pantsLength: selectedSize.mesurements[4].value
            });
          }
        }
        console.log(selectedItemMesurements);
        console.log(Object.keys(selectedItemMesurements?selectedItemMesurements:{}).length);
          setLoading((prev)=>({...prev,sizes:false}));
      } catch (error) {
        console.error("Error fetching variants:", error);
      }
    }

    async function getProductImages() {
      const response = await fetch(process.env.NEXT_PUBLIC_Default_Api_Url + "products/" + product.id + "/images");
      if(!response.ok){
        console.error("Failed to fetch : " + response.url + "\nstatus: " + response.status);
        return; 
      } 
      const jsonResponse = await response.json();
      let images;
      if(jsonResponse.images.length > 0){
        images = [
          product?.previewImage,
          jsonResponse.images.map((item)=>{return item.image_url})
        ].flat();
      }else{
        images = [product?.previewImage];
      }
      setActivePreview(images[0]);
      setProductWithDetailles((prev)=>({...prev,images}));
      setLoading((prev)=>({...prev,images:false}));
    }
  
    if (product?.id) {
      getProductVariants();
      getProductSizes();
      getProductImages();
    }
  }, [product]);
  //to load colors
  useEffect(()=>{
    if (!productWithDetailles?.variants) return;

    const colors = ExtractWithoutRepetition(productWithDetailles.variants,"color");
      setProductWithDetailles((prev)=>({...prev,colors}));
      setLoading((prev)=>({...prev,colors:false}));
  },[productWithDetailles?.variants])
  //to chose selected variant when he chose color and size
  useEffect(()=>{
    if (!productWithDetailles?.variants) return;

    const foundVariant = productWithDetailles.variants.find(v => v.color == selectedVariant.color && v.size == selectedVariant.size);
    if(foundVariant) {
      setSelectedVariant(foundVariant);
      const quantityInCart = carteItems.find(item => item.id == foundVariant.id)?.quantity ?? 0;
      setSelectedVariantQuantityInCart(quantityInCart);

          const selectedSize = productMesurements.find((product)=>(product.size == foundVariant.size))
          if(selectedSize?.mesurements.length > 0){
            setSelectedItemMesurements({
              size:selectedVariant.size,
              shirtLength: selectedSize.mesurements[0].value,
              sleeveLength: selectedSize.mesurements[1].value,
              pantsLength: selectedSize.mesurements[2].value
            });
          }else{
            setSelectedItemMesurements(null);
          }
        
    }else{
      const emptyVariant = {id:null,color:selectedVariant.color,size:selectedVariant.size,quantity:0};
      setSelectedVariant(emptyVariant);
    }
  },[selectedVariant?.color,selectedVariant?.size])
  
  return (
    <>
      {
        !isAllLoaded ?
        <div
      className={`${
        isModalOpen ? "z-99999" : "hidden"
      } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5`}
    >
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={() => closeModal()}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill=""
              />
            </svg>
          </button>

          <div className="flex justify-center items-center h-96 gap-12.5">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue border-t-transparent"></div>
          </div>
        </div>
      </div>
    </div>
        :
        <div
      className={`${
        isModalOpen ? "z-99999" : "hidden"
      } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5`}
    >
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={() => closeModal()}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill=""
              />
            </svg>
          </button>

          <div className="flex flex-wrap items-center gap-12.5">
            <div className="max-w-[526px] w-full">
              <div className="flex gap-5">
                <div className="flex flex-col gap-5">
                  {productWithDetailles.images?.map((img, key) => (
                    <button
                      onClick={() => setPreviewImageIndex(key)}
                      key={key}
                      className={`flex items-center justify-center w-20 h-20 overflow-hidden rounded-lg bg-gray-1 ease-out duration-200 hover:border-2 hover:border-blue ${
                        activePreview === key && "border-2 border-blue"
                      }`}
                    >
                      <Image
                        src={img || ""}
                        alt="thumbnail"
                        width={61}
                        height={61}
                        className="aspect-square"
                      />
                    </button>
                  ))}
                </div>

                <div className="relative z-1 overflow-hidden flex items-center justify-center w-full sm:min-h-[508px] bg-gray-1 rounded-lg border border-gray-3">
                  <div>
                    <button
                      onClick={zoomCurrentPreviewImage}
                      aria-label="button for zoom"
                      className="gallery__Image w-10 h-10 rounded-[5px] bg-white shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-8 right-4 lg:right-8 z-50"
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
                          fill=""
                        />
                      </svg>
                    </button>

                    {productWithDetailles?.images &&
                      productWithDetailles.images[previewImageIndex] &&
                      <Image
                      src={productWithDetailles?.images[previewImageIndex]}
                      alt="products-details"
                      width={400}
                      height={400}
                    />
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-[445px] w-full">
              {/* <span className="inline-block text-custom-xs font-medium text-white py-1 px-3 bg-green mb-6.5">
                SALE 20% OFF
              </span> */}

              <h3 className="font-semibold text-xl xl:text-heading-5 text-dark mb-4">
                {product.name}
              </h3>

              <p>
                {product.description}
              </p>
                    {/* Colors */}
                  <div>
                    <h4 className="font-semibold text-lg text-dark mt-6 mb-3.5">
                      Colors
                    </h4>

                    <div className="flex items-center flex-wrap gap-3">
                      {productWithDetailles?.colors && productWithDetailles.colors.map((color, index) => (
                        <button key={index} className={`border rounded-md  px-4 text-dark ${selectedVariant.color == color ? 'text-red' : ''}`}
                                onClick={()=>{
                                  setSelectedVariant((prev)=>({...prev,color}))
                                  }}>
                          {color}
                        </button>
                      ))}
                    </div> 
                  </div>

                      {/* Sizes */}
                  <div>
                    <h4 className="font-semibold text-lg text-dark mt-6 mb-3.5">
                      Sizes
                    </h4>

                    <div className="flex items-center flex-wrap gap-3">
                      {productWithDetailles?.sizes && productWithDetailles.sizes.map((size, index) => (
                        <button key={index} className={`border rounded-md  px-4 text-dark ${selectedVariant.size == size ? 'text-red' : ''}`}
                        onClick={() => {
                          setSelectedVariant((prev)=>({...prev,size}));
                        }}>
                          {size}
                        </button>
                      ))}
                    </div> 
                  </div>

                  {/* Sizes mesurement */}
             {
              selectedItemMesurements && 
               <div className="mt-4 p-2 bg-gray-3 rounded-lg w-full">
                <h3 className="text-red-dark text-lg">{t('ItemSizes')}</h3>
                <ol className="text-dark">
                    <li>{t('ShirtLength')}: {selectedItemMesurements.shirtLength}cm</li>
                    <li>{t('SleeveLength')}: {selectedItemMesurements.sleeveLength}cm</li>
                    <li>{t('PantsLength')}: {selectedItemMesurements.pantsLength}cm</li>
                    {Object.keys(selectedItemMesurements).length > 4 && (
                          <>
                            <li>{t('jacketLength')}: {selectedItemMesurements.jacketLength}cm</li>
                            <li>{t('jacketSleeveLength')}: {selectedItemMesurements.jacketSleeveLength}cm</li>
                          </>
                        )}
                </ol>
              </div>
             }

              <div className="flex flex-wrap justify-between gap-2 mt-6 mb-7.5">
                <div className="flex justify-between w-full">
                  <div className="flex justify-center items-center">
                    <h4 className="font-semibold text-lg text-dark mr-2">
                      Price:
                    </h4>

                    <span className="flex items-center gap-2 font-medium text-lg">
                      <span className={`text-dark ${product.discountedPrice != null ? '' : 'hidden'}`}>{product.discountedPrice}DA</span>
                      <span className={`${product.discountedPrice != null ? 'text-dark-4 line-through' : 'text-dark'}`}>{product.price}DA</span>
                    </span>
                  </div>

                  <div className="flex items-center">
                    <h4 className="font-semibold text-lg text-dark mr-2">
                      Quantity:
                    </h4>

                    <div className="flex gap-1 h-10">
                      <span
                        className="flex items-center justify-center w-10 h-10 rounded-[5px] border border-gray-4 bg-white font-medium text-dark"
                        x-text="quantity"
                      >
                        {quantity}
                      </span>

                      <div className="flex flex-col h-full">
                      <button
                          onClick={() => setQuantity(quantity + 1)}
                          aria-label="button for add product"
                          className="flex items-start justify-center w-10 h-[50%] rounded-[5px] bg-gray-2 text-dark mt-1 ease-out duration-200 hover:text-blue"
                        >
                          <svg
                            className="fill-current"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.08889 0C8.6289 2.36047e-08 9.06667 0.437766 9.06667 0.977778L9.06667 15.0222C9.06667 15.5622 8.6289 16 8.08889 16C7.54888 16 7.11111 15.5622 7.11111 15.0222L7.11111 0.977778C7.11111 0.437766 7.54888 -2.36047e-08 8.08889 0Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0 7.91111C4.72093e-08 7.3711 0.437766 6.93333 0.977778 6.93333L15.0222 6.93333C15.5622 6.93333 16 7.3711 16 7.91111C16 8.45112 15.5622 8.88889 15.0222 8.88889L0.977778 8.88889C0.437766 8.88889 -4.72093e-08 8.45112 0 7.91111Z"
                              fill=""
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                          aria-label="button for remove product"
                          className="flex items-end justify-center w-10 h-[50%] rounded-[5px] text-dark mb-2 ease-out duration-200 hover:text-blue"
                          disabled={quantity < 0 && true}
                        >
                          <svg
                            className="fill-current"
                            width="16"
                            height="2"
                            viewBox="0 0 16 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M-8.548e-08 0.977778C-3.82707e-08 0.437766 0.437766 3.82707e-08 0.977778 8.548e-08L15.0222 1.31328e-06C15.5622 1.36049e-06 16 0.437767 16 0.977779C16 1.51779 15.5622 1.95556 15.0222 1.95556L0.977778 1.95556C0.437766 1.95556 -1.32689e-07 1.51779 -8.548e-08 0.977778Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-2`}>
                  {/* when quantity grether than 0 */}
                  <div className={`flex items-center gap-1 ${selectedVariant?.quantity == 0 ? 'hidden' : ''}`}>
                    <svg className={`${selectedVariant ? (selectedVariant.quantity - selectedVariantQuantityInCart < quantity ? '' : 'hidden') : ''}`} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="9" stroke="#FF3B30" />
                      <path
                        d="M13.5 6.5L6.5 13.5M6.5 6.5L13.5 13.5"
                        stroke="#B71C1C"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  
                    <svg className={`${selectedVariant ? (selectedVariant.quantity - selectedVariantQuantityInCart>= quantity  ? '' : 'hidden') : ''}`} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="9" stroke="#22AD5C" />
                        
                        <path
                        d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z"
                        fill="#22AD5C"
                      />
                    </svg>
                    <span className="font-medium text-dark"> {selectedVariant?.quantity - selectedVariantQuantityInCart>= quantity  ? 'In Stock' : selectedVariant.quantity + ' Available in stock'} </span>
                  </div>

                  {/* Out of stock */}
                  <div className={`flex items-center gap-1 ${selectedVariant?.quantity == 0 ? '' : 'hidden'}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="9" stroke="#FF3B30" />
                        <path
                          d="M13.5 6.5L6.5 13.5M6.5 6.5L13.5 13.5"
                          stroke="#B71C1C"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>

                      <span className="font-medium text-dark">Out of stock</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  disabled={selectedVariant?.quantity - selectedVariantQuantityInCart < quantity}
                  onClick={() => handleAddToCart()}
                  className={`inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:text-gray-4 disabled:cursor-not-allowed disabled:bg-gray-2
                  `}
                >
                  Add to Cart
                </button>

                <button
                  className={`inline-flex items-center gap-2 font-medium text-white bg-dark py-3 px-6 rounded-md ease-out duration-200 hover:bg-opacity-95 `}
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.68698 3.68688C3.30449 4.31882 2.29169 5.82191 2.29169 7.6143C2.29169 9.44546 3.04103 10.8569 4.11526 12.0665C5.00062 13.0635 6.07238 13.8897 7.11763 14.6956C7.36588 14.8869 7.61265 15.0772 7.85506 15.2683C8.29342 15.6139 8.68445 15.9172 9.06136 16.1374C9.43847 16.3578 9.74202 16.4584 10 16.4584C10.258 16.4584 10.5616 16.3578 10.9387 16.1374C11.3156 15.9172 11.7066 15.6139 12.145 15.2683C12.3874 15.0772 12.6342 14.8869 12.8824 14.6956C13.9277 13.8897 14.9994 13.0635 15.8848 12.0665C16.959 10.8569 17.7084 9.44546 17.7084 7.6143C17.7084 5.82191 16.6955 4.31882 15.3131 3.68688C13.97 3.07295 12.1653 3.23553 10.4503 5.01733C10.3325 5.13974 10.1699 5.20891 10 5.20891C9.83012 5.20891 9.66754 5.13974 9.54972 5.01733C7.83474 3.23553 6.03008 3.07295 4.68698 3.68688ZM10 3.71573C8.07331 1.99192 5.91582 1.75077 4.16732 2.55002C2.32061 3.39415 1.04169 5.35424 1.04169 7.6143C1.04169 9.83557 1.9671 11.5301 3.18062 12.8966C4.15241 13.9908 5.34187 14.9067 6.39237 15.7155C6.63051 15.8989 6.8615 16.0767 7.0812 16.2499C7.50807 16.5864 7.96631 16.9453 8.43071 17.2166C8.8949 17.4879 9.42469 17.7084 10 17.7084C10.5754 17.7084 11.1051 17.4879 11.5693 17.2166C12.0337 16.9453 12.492 16.5864 12.9188 16.2499C13.1385 16.0767 13.3695 15.8989 13.6077 15.7155C14.6582 14.9067 15.8476 13.9908 16.8194 12.8966C18.0329 11.5301 18.9584 9.83557 18.9584 7.6143C18.9584 5.35424 17.6794 3.39415 15.8327 2.55002C14.0842 1.75077 11.9267 1.99192 10 3.71573Z"
                      fill=""
                    />
                  </svg>
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      }
    </>
  );
};

export default QuickViewModal;
