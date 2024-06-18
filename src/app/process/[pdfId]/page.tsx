"use client";
import ImageRenderer from "@/components/process/image-render";
import LeftPageBar from "@/components/process/left-page-bar";
import PageInfo from "@/components/process/page-info";
import { GET_PDF_PAGES, START_PDF_EXTRACTION } from "@/lib/constants";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
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
  const [pageNo, setPageNo] = useState<string>("");
  const [isLeftBarOpen, setIsLeftBarOpen] = useState<boolean>(true);
  const [imageByteString, setImageByteString] = useState<string>("");

  const searchParams = useSearchParams();

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

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const page = params.get("page");
    if (page) {
      setPageNo(page);
    }
  }, [searchParams]);

  return (
    <div>
      <LeftPageBar
        pdfPages={pdfPages}
        pageId={pageNo}
        isOpen={isLeftBarOpen}
        setOpen={setIsLeftBarOpen}
        setImageByteString={setImageByteString}
      />
      <div className="flex">
        <PageInfo
          pdfId={pdfId}
          pageId={pageNo}
          isPageBarOpen={isLeftBarOpen}
          imageByteString={imageByteString}
          setImageByteString={setImageByteString}
          firstPageId={pdfPages[0]?._id || ""}
        />
        {imageByteString && (
          <ImageRenderer
            byteString={imageByteString}
            altText={"Image"}
            setByteString={setImageByteString}
          />
        )}
      </div>
    </div>
  );
};

export default Process;

// import React from "react";

// const page = () => {
//   return <div>process page</div>;
// };

// export default page;
