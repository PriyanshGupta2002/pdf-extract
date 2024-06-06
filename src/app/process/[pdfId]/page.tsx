"use client";
import LeftPageBar from "@/components/process/left-page-bar";
import PageInfo from "@/components/process/page-info";
import { GET_PDF_PAGES, START_PDF_EXTRACTION } from "@/constants";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export interface PdfPagesTypes {
  Crop_URL: string;
  _id: string;
  Parent_ID: string;
}

// const getPdfPageDetails=useCallback(()=>{},[])
const Process = () => {
  const [pdfPages, setPdfPages] = useState<PdfPagesTypes[]>([]);
  const { pdfId } = useParams<{ pdfId: string }>();

  const fetchPdfPages = useCallback(async (id: string) => {
    try {
      const { data } = await axios.get(`${GET_PDF_PAGES}/${id}`);
      setPdfPages(data);
    } catch (error) {
      console.log("Error while fetching pdf pages", error);
    }
  }, []);

  useEffect(() => {
    if (pdfId) {
      fetchPdfPages(pdfId);
    }
  }, [fetchPdfPages, pdfId]);

  return (
    <div>
      <LeftPageBar pdfPages={pdfPages} />
      <PageInfo pdfId={pdfId as string} />
    </div>
  );
};

export default Process;

// import React from "react";

// const page = () => {
//   return <div>process page</div>;
// };

// export default page;
