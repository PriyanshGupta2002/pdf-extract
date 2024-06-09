"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { GET_PAGE_INFO, START_PDF_EXTRACTION } from "@/lib/constants";
import axios from "axios";
import Image from "next/image";
import React, { FC, useCallback, useEffect, useState } from "react";
import Wrapper from "./wrapper";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { Project } from "@/lib/types";
import { Button } from "../ui/button";

interface PageInfoProps {
  pdfId: string;
  pageId: string;
  isPageBarOpen: boolean;
  imageByteString: string;
  setImageByteString: (imgByteString: string) => void;
}

const PageInfo: FC<PageInfoProps> = ({
  pdfId,
  pageId,
  isPageBarOpen,
  setImageByteString,
  imageByteString,
}) => {
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<Project>();
  const levels = {
    Medium: "#FAA160",
    Low: "#10C400",
    High: "#FF0000",
    default: "gray", // Default color level
  };

  useEffect(() => {
    const startPdfExtraction = async () => {
      if (pdfId) {
        try {
          setIsExtracting(true);
          await axios.get(`${START_PDF_EXTRACTION}/${pdfId}`);
        } catch (error) {
          console.log("Error while running pdf extraction", error);
        } finally {
          setIsExtracting(false);
        }
      }
    };
    startPdfExtraction();
  }, [pdfId]);

  const getPageInfo = useCallback(async (pageId: string) => {
    try {
      const { data } = await axios.get(`${GET_PAGE_INFO}/${pageId}`);
      setPageInfo(data);
    } catch (error) {
      console.log("Error while getting page info", error);
    }
  }, []);

  useEffect(() => {
    if (pageId && !isExtracting) {
      getPageInfo(pageId);
    }
  }, [getPageInfo, isExtracting, pageId]);

  // console.log(pageInfo?.Context);

  return (
    <div
      className={cn(
        "transition-all ease-linear duration-300 p-3 w-full",
        isPageBarOpen ? "ml-52" : "ml-0"
      )}
    >
      {isExtracting ? (
        <h1>Extarcting please wait....</h1>
      ) : (
        <div className="space-y-2 bg-lightWhite300 p-3 rounded-md">
          <div className="flex justify-between border-b-2 border-b-[#143F93] p-3 font-normal">
            <div className="flex items-center gap-2">
              <span>Project Extraction</span>
              {pageInfo?.Image_String && (
                <Eye
                  onClick={() =>
                    setImageByteString(pageInfo.Image_String || "")
                  }
                  className="w-5 h-5 cursor-pointer text-darkBlack600"
                />
              )}
            </div>
            <Image
              src={"/assets/doh.svg"}
              width={90}
              height={90}
              alt="Department of Health"
            />
          </div>

          <div className="font-bold flex items-center justify-between text-base">
            <span>{pageInfo?.Project_Name}</span>
            <span>Budget - {pageInfo?.Budget}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {pageInfo?.Context && (
              <Wrapper className="max-h-[200px] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="text-darkBlack700 text-sm font-bold">
                    Alignment
                  </span>
                </div>
                <div className="flex items-center w-full gap-8">
                  {Object?.entries(pageInfo?.Context).map(
                    ([key, value], idx) => (
                      <div key={idx} className="flex flex-col gap-2 text-sm">
                        <span className="text-darkBlack700 font-medium">
                          {key}
                        </span>
                        <span className="text-darkBlack600 font-normal">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </Wrapper>
            )}
            <Wrapper className="max-h-[200px] overflow-y-auto">
              <div className="flex items-center justify-between gap-2">
                <span className="text-darkBlack700 font-bold text-sm">
                  Overview
                </span>
              </div>
              {Object.entries(pageInfo?.Overview || {}).map(
                ([key, value], idx) => (
                  <div className="flex items-center text-sm gap-2" key={idx}>
                    <span className="text-darkBlack700 font-medium">
                      {key}:
                    </span>
                    <span className="text-darkBlack600 font-normal">
                      {value}
                    </span>
                  </div>
                )
              )}
            </Wrapper>
            <Wrapper className="max-h-[200px] overflow-y-auto">
              <div className="flex items-center justify-between gap-2">
                <span className="text-darkBlack700 font-bold text-sm">
                  Owner
                </span>
              </div>

              <div
                className={cn(
                  "flex  gap-8",
                  imageByteString ? "flex-col gap-5" : "flex-row"
                )}
              >
                {Object?.entries(pageInfo?.Owner || {})?.map(
                  ([key, value], idx) => (
                    <div className="flex flex-col gap-1 text-sm" key={idx}>
                      <span className="text-darkBlack700 font-medium">
                        {key}
                      </span>
                      <span className="text-darkBlack700 font-normal">
                        {Array.isArray(value) ? value.join(",") : value}
                      </span>
                    </div>
                  )
                )}
              </div>
            </Wrapper>
            <Wrapper className="max-h-[200px] overflow-y-auto">
              <div className="flex items-center justify-between gap-2">
                <span className="text-darkBlack700 font-bold text-sm">
                  Stakeholders
                </span>
              </div>
              {pageInfo?.Stakeholders && (
                <div className="flex flex-col gap-3">
                  {pageInfo?.Stakeholders?.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-darkBlack700 font-normal text-sm"
                    >
                      {idx + 1}. {item}
                    </span>
                  ))}
                </div>
              )}
            </Wrapper>
            <Wrapper
              className={cn(
                "max-h-[200px] overflow-y-auto",
                imageByteString ? "col-span-2" : "col-span-1"
              )}
            >
              <div className="flex justify-between items-center gap-2">
                <span className="text-darkBlack700 font-bold text-sm">
                  Initiative Details
                </span>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="text-sm">
                  {" "}
                  <span className="text-darkBlack700 font-medium">
                    {" "}
                    Description -{" "}
                  </span>
                  <span className="text-darkBlack600 font-normal">
                    {pageInfo?.Initiative_Details["Program description"]}
                  </span>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <span className="text-darkBlack700 font-medium">
                    Key Deliverables
                  </span>
                  {pageInfo?.Initiative_Details.Deliverables.map(
                    (item, idx) => (
                      <span key={idx} className="font-normal text-darkBlack600">
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            </Wrapper>
            {pageInfo?.List_of_Sub_Initiatives && (
              <Wrapper
                className={cn(
                  "max-h-[200px] overflow-y-auto",
                  imageByteString ? "col-span-2" : "col-span-1"
                )}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="text-darkBlack700 font-bold text-sm">
                    Sub Initiatives
                  </span>
                </div>
                <div>
                  {pageInfo?.List_of_Sub_Initiatives?.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-sm text-darkBlack600 font-normal"
                    >
                      {item === "Not Found" ? item : `${idx + 1}.${item}`}
                    </span>
                  ))}
                </div>
              </Wrapper>
            )}
            {pageInfo?.Interdependencies && (
              <Wrapper
                className={cn(
                  "max-h-[200px] overflow-y-auto",
                  imageByteString ? "col-span-2" : "col-span-1"
                )}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="text-darkBlack700 font-bold text-sm">
                    Interdependencies
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  {pageInfo?.Interdependencies?.map((item, idx) => (
                    <div className="flex text-sm flex-col gap-1" key={idx}>
                      <span className="text-darkBlack700 font-medium">
                        Entity -{" "}
                        {item["External Stakeholder" ?? "External Entity"]}
                      </span>
                      <span className="text-darkBlack700 font-normal pl-3">
                        Support -{" "}
                        {
                          item[
                            "Required support to implement the program" ??
                              "Required support to implement the initiative"
                          ]
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </Wrapper>
            )}

            {pageInfo?.Key_Performance_Indicators && (
              <Wrapper
                className={cn(
                  "max-h-[200px] overflow-y-auto",
                  imageByteString ? "col-span-2" : "col-span-1"
                )}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="text-darkBlack700 font-bold text-sm">
                    Key Performance Indicators
                  </span>
                </div>

                <Accordion type="single" collapsible>
                  {pageInfo.Key_Performance_Indicators.map((item, idx) => (
                    <AccordionItem value={`item-${idx}`} key={idx}>
                      <AccordionTrigger className="text-sm text-darkBlack700">
                        {item.kpi_type}
                      </AccordionTrigger>

                      <AccordionContent asChild>
                        {item.data?.map((inKpi, idx) => (
                          <div key={idx} className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-darkBlack700">
                              {inKpi.KPI}
                            </span>
                            <Table>
                              <TableHeader>
                                <TableRow className="text-sm text-darkBlack700 font-medium">
                                  {Object.keys(inKpi.Targets ?? {}).map(
                                    (key, idx) => (
                                      <TableHead
                                        key={idx}
                                        className="w-[100px]"
                                      >
                                        {key}
                                      </TableHead>
                                    )
                                  )}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow className="border border-gray-200 px-4 py-2 text-darkBlack600 font-normal text-sm">
                                  {Object.values(inKpi.Targets ?? {}).map(
                                    (value, idx) => (
                                      <TableCell key={idx}>{value}</TableCell>
                                    )
                                  )}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Wrapper>
            )}

            {pageInfo?.Risks_and_Mitigations && (
              <Wrapper
                className={cn(
                  "max-h-[200px] overflow-y-auto",
                  imageByteString ? "col-span-2" : "col-span-1"
                )}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="text-darkBlack700 font-bold text-sm">
                    Risks
                  </span>
                  <div className="flex items-center gap-2">
                    {Object.entries(levels).map(([key, value], idx) => (
                      <div
                        className="flex items-center gap-1 text-xs text-darkBlack600 justify-center"
                        key={idx}
                      >
                        <span>{key}</span>
                        <span
                          style={{ background: value }}
                          className={`w-2 h-2 rounded-full`}
                        ></span>
                      </div>
                    ))}
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="text-sm">
                      <TableHead className="w-[100px]">#</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Impact Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageInfo?.Risks_and_Mitigations.map((item, idx) => {
                      const impactLevel = item["Impact level"] || "default"; // Provide a default value

                      return (
                        <TableRow
                          key={idx}
                          className="text-sm text-darkBlack700 font-medium"
                        >
                          <TableCell>{idx + 1}.</TableCell>
                          <TableCell>{item.Risk}</TableCell>
                          <TableCell>
                            <div
                              style={{
                                background: `${levels[impactLevel]}`,
                              }}
                              className="rounded-full w-3 h-3"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Wrapper>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageInfo;
