"use client";
import React, { createContext, useContext, useState } from "react";

interface PreviewSliderType {
  isModalPreviewOpen: boolean;
  currentIndex: number;
  imagesList:string[];
  openPreviewModal: (currentIndex:number,imagesList:string[]) => void;
  closePreviewModal: () => void;
}

const PreviewSlider = createContext<PreviewSliderType | undefined>(undefined);

export const usePreviewSlider = () => {
  const context = useContext(PreviewSlider);
  if (!context) {
    throw new Error("usePreviewSlider must be used within a ModalProvider");
  }
  return context;
};

export const PreviewSliderProvider = ({ children }) => {
  const [isModalPreviewOpen, setIsModalOpen] = useState(false);
  const [currentIndex,setCurrentIndex] = useState(0);
  const [imagesList,setImagesList] = useState([]);

  const openPreviewModal = (currentIndex:number,imagesList:string[]) => {
    setIsModalOpen(true);
    setCurrentIndex(currentIndex);
    setImagesList(imagesList);
  };

  const closePreviewModal = () => {
    setIsModalOpen(false);
    setCurrentIndex(0);
    setImagesList([]);
  };

  return (
    <PreviewSlider.Provider
      value={{ isModalPreviewOpen, currentIndex,imagesList,openPreviewModal, closePreviewModal }}
    >
      {children}
    </PreviewSlider.Provider>
  );
};
