"use client";
import { START_PDF_EXTRACTION } from "@/constants";
import axios from "axios";
import React, { FC, useCallback, useEffect, useState } from "react";

interface PageInfoProps {
  pdfId: string;
}

const PageInfo: FC<PageInfoProps> = ({ pdfId }) => {
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  useEffect(() => {
    const startPdfExtraction = async () => {
      if (pdfId) {
        try {
          setIsExtracting(true);
          const { data } = await axios.get(`${START_PDF_EXTRACTION}/${pdfId}`);
          console.log(!data.message ? "isExtarcting" : "Extarcted");
          return data.message;
        } catch (error) {
          console.log("Error while running pdf extraction", error);
        } finally {
          setIsExtracting(false);
        }
      }
    };
    startPdfExtraction();
  }, [pdfId]);

  return (
    <div className="ml-52 p-3">
      {isExtracting ? (
        <h1>Extarcting please wait....</h1>
      ) : (
        <h1>Extarction done</h1>
      )}
    </div>
  );
};

export default PageInfo;
