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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  GET_PAGE_INFO,
  START_PDF_EXTRACTION,
  UPDATE_PAGE,
} from "@/lib/constants";
import axios from "axios";
import Image from "next/image";
import React, { FC, useCallback, useEffect, useState } from "react";
import Wrapper from "./wrapper";
import { cn } from "@/lib/utils";
import { Delete, Edit, Eye, Save, Trash } from "lucide-react";
import { KPIData, Project } from "@/lib/types";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import Summary from "./summary";

interface PageInfoProps {
  pdfId: string;
  pageId: string;
  isPageBarOpen: boolean;
  imageByteString: string;
  setImageByteString: (imgByteString: string) => void;
  firstPageId: string;
}

const PageInfo: FC<PageInfoProps> = ({
  pdfId,
  pageId,
  isPageBarOpen,
  setImageByteString,
  imageByteString,
  firstPageId,
}) => {
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<Project>();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const levels = {
    Medium: "#FAA160",
    Low: "#10C400",
    High: "#FF0000",
    default: "gray", // Default color level
  };

  const router = useRouter();

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClick = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams);
      if (id) {
        params.set("page", id);
      } else {
        params.delete("id");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

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

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const isPageInParams = params.get("page");
    if (!isExtracting && !isPageInParams) {
      handleClick(firstPageId);
    }
  }, [firstPageId, handleClick, isExtracting, pageId, searchParams]);

  console.log(pageId);
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

  const handleEditAlignment = (key: string, value: string) => {
    setPageInfo((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        Context: {
          ...prev.Context,
          [key]: value,
        },
      };
    });
  };
  const handleEditOverview = (key: string, value: string) => {
    setPageInfo((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        Overview: {
          ...prev.Overview,
          [key]: value,
        },
      };
    });
  };

  const handleEditOwner = (
    key: string,
    index: number,
    value: string | string[]
  ) => {
    setPageInfo((prev) => {
      if (!prev) return prev;
      const updatedOwner: any = { ...prev.Owner };
      if (Array.isArray(updatedOwner[key])) {
        updatedOwner[key] = [...(updatedOwner[key] || [])];
        updatedOwner[key][index] = value;
      } else {
        updatedOwner[key] = value;
      }
      return {
        ...prev,
        Owner: updatedOwner,
      };
    });
  };

  const handleStakeHolders = (idx: number, value: string) => {
    setPageInfo((prev) => {
      if (!prev) {
        return prev;
      }
      const updatedStakeholders = [...(prev.Stakeholders || [])];
      updatedStakeholders[idx] = value;
      return {
        ...prev,
        Stakeholders: updatedStakeholders,
      };
    });
  };

  const handleInitiativeDetails = (key: string, idx: number, value: string) => {
    setPageInfo((prev) => {
      if (!prev) {
        return prev;
      }
      const updatedInitiative: any = { ...prev.Initiative_Details };
      if (Array.isArray(updatedInitiative[key])) {
        updatedInitiative[key] = [...(updatedInitiative[key] || [])];
        updatedInitiative[key][idx] = value;
      } else {
        updatedInitiative[key] = value;
      }
      return {
        ...prev,
        Initiative_Details: updatedInitiative,
      };
    });
  };

  const handleInterdependencies = (idx: number, key: string, value: string) => {
    setPageInfo((prev) => {
      if (!prev) return prev;
      if (Array.isArray(prev.Interdependencies)) {
        const updatedInterdependencies = [...prev.Interdependencies];
        // if (!updatedInterdependencies[idx]) {
        //   updatedInterdependencies[idx] = {};
        // }
        updatedInterdependencies[idx][key] = value;
        console.log(updatedInterdependencies);
        return {
          ...prev,
          Interdependencies: updatedInterdependencies,
        };
      }
    });
  };

  const updateKPI = (
    kpiIndex: number,
    dataIdx: number,
    key: keyof KPIData,
    subKey: string,
    value: string,
    type?: "kpi_type" | "KPI"
  ) => {
    setPageInfo((prev) => {
      if (!prev) return prev;

      const updatedKPIs = prev.Key_Performance_Indicators?.map((kpi, index) => {
        if (index === kpiIndex) {
          if (type === "kpi_type") {
            return {
              ...kpi,
              kpi_type: value,
            };
          } else if (type === "KPI") {
            const updatedData = kpi.data?.map((item, dataIndex) => {
              if (dataIndex === dataIdx) {
                return {
                  ...item,
                  KPI: value,
                };
              }
              return item;
            });
            return {
              ...kpi,
              data: updatedData,
            };
          } else {
            const updatedData = kpi.data?.map((item, dataIndex) => {
              if (dataIndex === dataIdx) {
                if (key === "Targets" && item.Targets) {
                  return {
                    ...item,
                    Targets: {
                      ...item.Targets,
                      [subKey]: value,
                    },
                  };
                } else if (key !== "Targets") {
                  return {
                    ...item,
                    [key]: value,
                  };
                }
              }
              return item;
            });
            return {
              ...kpi,
              data: updatedData,
            };
          }
        }
        return kpi;
      });

      return {
        ...prev,
        Key_Performance_Indicators: updatedKPIs,
      };
    });
  };

  const updateRisk = (
    idx: number,
    field: "Risk" | "Risks" | "Impact Level" | "Impact level",
    value: string
  ) => {
    setPageInfo((prev) => {
      if (!prev) return prev;

      const updatedRisks = prev?.Risks_and_Mitigations?.map((item, index) => {
        if (index === idx) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      });

      return {
        ...prev,
        Risks_and_Mitigations: updatedRisks,
      };
    });
  };

  const updateSubInitiative = (idx: number, value: string) => {
    setPageInfo((prev) => {
      if (!prev) return prev;
      const updatedSubInitiative = [...(prev?.List_of_Sub_Initiatives || [])];
      updatedSubInitiative[idx] = value;

      return {
        ...prev,
        List_of_Sub_Initiatives: updatedSubInitiative,
      };
    });
  };

  const updateSummary = (value: string) => {
    setPageInfo((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        Summary: value,
      };
    });
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.post(UPDATE_PAGE, {
        payload: {
          Context: pageInfo?.Context,
          Overview: pageInfo?.Overview,
          Owner: pageInfo?.Owner,
          Stakeholders: pageInfo?.Stakeholders,
          Status: pageInfo?.Status,
          List_of_Sub_Initiatives: pageInfo?.List_of_Sub_Initiatives,
          Initiative_Details: pageInfo?.Initiative_Details,
          Interdependencies: pageInfo?.Interdependencies,
          Risks_and_Mitigations: pageInfo?.Risks_and_Mitigations,
          Key_Performance_Indicators: pageInfo?.Key_Performance_Indicators,
          Budget: pageInfo?.Budget,
          Path: pageInfo?.Path,
          DB_Id: pageId,
          Skip: pageInfo?.Skip,
          Extracted: pageInfo?.Extracted,
          Summary: pageInfo?.Summary,
        },
        action: "update",
      });
      setPageInfo(data);
    } catch (error) {
      console.log("Error while updating");
    } finally {
      setIsEditing(false);
    }
  };

  const handleAlignmentDelete = async (key: string) => {
    try {
      await axios.post(UPDATE_PAGE, {
        action: "delete-keys",
        payload: {
          DB_Id: pageId,
          deletions: {
            Context: [key],
          },
        },
      });
      await getPageInfo(pageId);
    } catch (error) {
      console.log("Error while deleting context", error);
    }
  };

  const handleOverviewDelete = async (key: string) => {
    try {
      await axios.post(UPDATE_PAGE, {
        action: "delete-keys",
        payload: {
          DB_Id: pageId,
          deletions: {
            Overview: [key],
          },
        },
      });

      await getPageInfo(pageId);
    } catch (error) {
      console.log("Error while deleting context", error);
    }
  };

  const handleOwnerDelete = useCallback(
    async (key: string, idx?: number, type?: "managers") => {
      try {
        let payload;
        if (type === "managers") {
          payload = {
            DB_Id: pageId,
            deletions: {
              Owner: {
                [key]: [idx],
              },
            },
          };
        } else {
          payload = {
            DB_Id: pageId,
            deletions: {
              Owner: [key],
            },
          };
        }
        await axios.post(UPDATE_PAGE, {
          action: "delete-keys",
          payload,
        });
        await getPageInfo(pageId);
      } catch (error) {
        console.log("Error while deleting context", error);
      }
    },
    [getPageInfo, pageId]
  );

  const handleStakeHolderandSubInitativesDelete = useCallback(
    async (idx: number, type: "Stakeholders" | "List_of_Sub_Initiatives") => {
      try {
        const payload = {
          DB_Id: pageId,
          deletions: {
            [type]: [idx],
          },
        };
        await axios.post(UPDATE_PAGE, {
          action: "delete-keys",
          payload,
        });
        await getPageInfo(pageId);
      } catch (error) {
        console.log("Error while deleting stakeholders", error);
      }
    },
    [getPageInfo, pageId]
  );

  const handleInitiativeDelete = useCallback(
    async (key: string, type?: "outcomes", idx?: number) => {
      try {
        let payload;
        if (type === "outcomes") {
          payload = {
            DB_Id: pageId,
            deletions: {
              Initiative_Details: {
                [key]: [idx],
              },
            },
          };
        } else {
          payload = {
            DB_Id: pageId,
            deletions: {
              Initiative_Details: [key],
            },
          };
        }
        await axios.post(UPDATE_PAGE, {
          action: "delete-keys",
          payload,
        });

        await getPageInfo(pageId);
      } catch (error) {}
    },
    [getPageInfo, pageId]
  );

  const handleInterdependenciesDelete = useCallback(
    async (index: number, key: string) => {
      try {
        const payload = {
          DB_Id: pageId,
          deletions: {
            Interdependencies: {
              index: [index],
              key: [key],
            },
          },
        };

        await axios.post(UPDATE_PAGE, {
          action: "delete-keys",
          payload,
        });
        await getPageInfo(pageId);
      } catch (error) {
        console.log("Error while deleting interdependencies");
      }
    },
    [getPageInfo, pageId]
  );

  const handleKpiDelete = useCallback(
    async (kpi_type: string, inKpiIdx: number, targetYear?: string) => {
      try {
        let payload;
        if (!targetYear) {
          console.log("hi");
          payload = {
            DB_Id: pageId,
            deletions: {
              Key_Performance_Indicators: {
                kpi_type,
                index: [inKpiIdx],
                Targets: null,
              },
            },
          };
        } else {
          payload = {
            DB_Id: pageId,
            deletions: {
              Key_Performance_Indicators: {
                kpi_type,
                index: [inKpiIdx],
                Targets: [targetYear],
              },
            },
          };
        }
        await axios.post(UPDATE_PAGE, {
          action: "delete-keys",
          payload,
        });
        await getPageInfo(pageId);
      } catch (error) {
        console.log("Error deleting handle kpi delete function", error);
      }
    },
    [getPageInfo, pageId]
  );

  const handleRiskDelete = useCallback(
    async (idx: number) => {
      try {
        const payload = {
          DB_Id: pageId,
          deletions: {
            Risks_and_Mitigations: [idx],
            // Risks_and_Mitigations: {
            //   index: [idx],
            // },
          },
        };
        await axios.post(UPDATE_PAGE, {
          action: "delete-keys",
          payload,
        });
        await getPageInfo(pageId);
      } catch (error) {
        console.log("Error while deleting risks");
      }
    },
    [getPageInfo, pageId]
  );

  return (
    <div
      className={cn(
        "transition-all ease-linear duration-300 p-3 w-full",
        isPageBarOpen ? "ml-52" : "ml-0"
      )}
    >
      {isExtracting ? (
        <h1>Extracting please wait....</h1>
      ) : !pageId ? (
        <h1>Please Select Page id to view data</h1>
      ) : pageInfo?.Skip && pageInfo.Extracted ? (
        <div className="bg-lightWhite300">
          {pageInfo.Summary ? (
            <div className="bg-lightWhite300 p-3">
              <Summary
                summary={pageInfo.Summary}
                isEditing={isEditing}
                handleUpdateSummary={updateSummary}
              />
            </div>
          ) : (
            `No information to show for this page`
          )}
        </div>
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
            <div className="flex items-center gap-4 text-sm">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                <span className="text-darkBlack600 font-normal">Edit </span>
                <Edit className="w-4 h-4" />
              </div>
              {isEditing && (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleSave}
                >
                  <span className="text-darkBlack600 font-normal">Save </span>
                  <Save className="w-4 h-4" />
                </div>
              )}
            </div>
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
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={value}
                              onChange={(e) =>
                                handleEditAlignment(key, e.target.value)
                              }
                            />
                            <Trash
                              className="text-rose-500 w-5 h-5 cursor-pointer"
                              onClick={() => {
                                handleAlignmentDelete(key);
                              }}
                            />
                          </div>
                        ) : (
                          <span className="text-darkBlack600 font-normal">
                            {value}
                          </span>
                        )}
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
                  <div
                    className={cn(
                      "flex items-center justify-between  text-sm gap-20"
                    )}
                    key={idx}
                  >
                    <span className="text-darkBlack700 font-medium">
                      {key}:
                    </span>
                    {isEditing ? (
                      <div className="flex items-center  gap-2">
                        <Input
                          value={value}
                          className="w-full"
                          onChange={(e) =>
                            handleEditOverview(key, e.target.value)
                          }
                        />
                        <Trash
                          className="text-rose-500 w-5 h-5 cursor-pointer"
                          onClick={() => {
                            handleOverviewDelete(key);
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-darkBlack600 font-normal">
                        {value}
                      </span>
                    )}
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
                        {Array.isArray(value) ? (
                          <div className="flex flex-col gap-2">
                            {value.map((item, inIdx) => (
                              <div key={inIdx}>
                                {" "}
                                {isEditing ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      defaultValue={item}
                                      onChange={(e) =>
                                        handleEditOwner(
                                          key,
                                          inIdx,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <Trash
                                      className="text-rose-500 w-5 h-5 cursor-pointer"
                                      onClick={() => {
                                        handleOwnerDelete(
                                          key,
                                          inIdx,
                                          "managers"
                                        );
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <span key={idx}>
                                    {inIdx + 1}. {item}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>
                            {" "}
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  defaultValue={value}
                                  onChange={(e) =>
                                    handleEditOwner(key, 0, e.target.value)
                                  }
                                />

                                <Trash
                                  className="text-rose-500 w-5 h-5 cursor-pointer"
                                  onClick={() => {
                                    handleOwnerDelete(key);
                                  }}
                                />
                              </div>
                            ) : (
                              <span className="text-sm font-normal text-darkBlack600">
                                {value}
                              </span>
                            )}
                          </>
                        )}
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
                    <div key={idx}>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            defaultValue={item}
                            onChange={(e) =>
                              handleStakeHolders(idx, e.target.value)
                            }
                          />
                          <Trash
                            className="text-rose-500 w-5 h-5 cursor-pointer"
                            onClick={() => {
                              handleStakeHolderandSubInitativesDelete(
                                idx,
                                "Stakeholders"
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-darkBlack700 font-normal text-sm">
                          {idx + 1}. {item}
                        </span>
                      )}
                    </div>
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

              <div className="flex flex-col space-y-4">
                {Object.entries(pageInfo?.Initiative_Details ?? {}).map(
                  ([key, value], idx) => (
                    <div key={idx} className="flex flex-col text-sm gap-2">
                      <span className="text-darkBlack700 font-medium">
                        {key}
                      </span>

                      {Array.isArray(value) ? (
                        value.map((item, idx) => {
                          const hasSerialNumber = /^\d+\.\s/.test(item);
                          const formattedItem = hasSerialNumber
                            ? item
                            : `${idx + 1}. ${item}`;

                          return (
                            <span
                              key={idx}
                              className="text-darkBlack600 font-normal block"
                            >
                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    defaultValue={formattedItem}
                                    onChange={(e) =>
                                      handleInitiativeDetails(
                                        key,
                                        idx,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <Trash
                                    className="text-rose-500 w-5 h-5 cursor-pointer"
                                    onClick={() => {
                                      handleInitiativeDelete(
                                        key,
                                        "outcomes",
                                        idx
                                      );
                                    }}
                                  />
                                </div>
                              ) : (
                                formattedItem
                              )}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-darkBlack600 font-normal">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <Input
                                defaultValue={value}
                                onChange={(e) =>
                                  handleInitiativeDetails(
                                    key,
                                    0,
                                    e.target.value
                                  )
                                }
                              />
                              <Trash
                                className="text-rose-500 w-5 h-5 cursor-pointer"
                                onClick={() => {
                                  handleInitiativeDelete(key);
                                }}
                              />
                            </div>
                          ) : (
                            value
                          )}
                        </span>
                      )}
                    </div>
                  )
                )}
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
                <div className="flex flex-col gap-3">
                  {pageInfo?.List_of_Sub_Initiatives?.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-sm text-darkBlack600 font-normal"
                    >
                      {item === "Not Found" ? (
                        item
                      ) : isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            defaultValue={item}
                            onChange={(e) =>
                              updateSubInitiative(idx, e.target.value)
                            }
                          />
                          <Trash
                            className="text-rose-500 w-5 h-5 cursor-pointer"
                            onClick={() => {
                              handleStakeHolderandSubInitativesDelete(
                                idx,
                                "List_of_Sub_Initiatives"
                              );
                            }}
                          />
                        </div>
                      ) : (
                        `${idx + 1}. ${item}`
                      )}
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
                    <div key={idx} className="flex flex-col gap-1">
                      {Object.entries(item).map(([key, value], index) => (
                        <div
                          className="flex items-center gap-1 text-sm"
                          key={index}
                        >
                          <span className="text-darkBlack700 font-medium">
                            {key}
                          </span>
                          <span className="text-darkBlack600 font-medium">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  defaultValue={value}
                                  onChange={(e) =>
                                    handleInterdependencies(
                                      idx,
                                      key,
                                      e.target.value
                                    )
                                  }
                                />
                                <Trash
                                  className="text-rose-500 w-5 h-5 cursor-pointer"
                                  onClick={() => {
                                    handleInterdependenciesDelete(index, key);
                                  }}
                                />
                              </div>
                            ) : (
                              value
                            )}
                          </span>
                        </div>
                      ))}
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
                  {pageInfo?.Key_Performance_Indicators?.map((item, idx) => (
                    <AccordionItem value={`item-${idx}`} key={idx}>
                      <AccordionTrigger className="text-sm text-darkBlack700">
                        {item.kpi_type}
                      </AccordionTrigger>

                      <AccordionContent asChild>
                        {item.data?.map((inKpi, dataIdx) => (
                          <div key={dataIdx} className="flex flex-col gap-2">
                            <div className="text-sm font-semibold text-darkBlack700">
                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    defaultValue={inKpi.KPI}
                                    onChange={(e) =>
                                      updateKPI(
                                        idx,
                                        dataIdx,
                                        "KPI",
                                        "",
                                        e.target.value,
                                        "KPI"
                                      )
                                    }
                                  />
                                  {isEditing && (
                                    <Trash
                                      className="text-rose-500 w-5 h-5 cursor-pointer"
                                      onClick={() => {
                                        handleKpiDelete(
                                          item.kpi_type || "",
                                          dataIdx
                                        );
                                      }}
                                    />
                                  )}
                                </div>
                              ) : (
                                <span>{inKpi.KPI}</span>
                              )}
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow className="text-sm text-darkBlack700 font-medium">
                                  {Object.keys(inKpi.Targets ?? {}).map(
                                    (key, idx) => (
                                      <TableHead
                                        key={idx}
                                        className="w-[100px]"
                                      >
                                        <div className="flex items-center gap-2">
                                          {key}
                                          {isEditing && (
                                            <Trash
                                              className="text-rose-500 w-3 h-3 cursor-pointer"
                                              onClick={() => {
                                                handleKpiDelete(
                                                  item.kpi_type || "",
                                                  dataIdx,
                                                  key
                                                );
                                              }}
                                            />
                                          )}
                                        </div>
                                      </TableHead>
                                    )
                                  )}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow className="border border-gray-200 px-4 py-2 text-darkBlack600 font-normal text-sm">
                                  {Object.entries(inKpi.Targets ?? {}).map(
                                    ([yearKey, value], idx) => (
                                      <TableCell key={idx}>
                                        {isEditing ? (
                                          <Input
                                            defaultValue={value}
                                            onChange={(e) =>
                                              updateKPI(
                                                idx,
                                                dataIdx,
                                                "Targets",
                                                yearKey,
                                                e.target.value
                                              )
                                            }
                                          />
                                        ) : (
                                          value
                                        )}
                                      </TableCell>
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
            {pageInfo?.Summary && (
              <Summary
                summary={pageInfo.Summary}
                isEditing={isEditing}
                handleUpdateSummary={updateSummary}
                imageByteString={imageByteString}
              />
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
                      {isEditing && <TableHead>Action</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageInfo?.Risks_and_Mitigations.map((item, idx) => {
                      const impactLevel =
                        item["Impact level"] ||
                        item["Impact Level"] ||
                        "default"; // Provide a default value

                      const risk =
                        item?.Risk?.replace(/^\d+\)\s/, "") ||
                        item?.Risks?.replace(/^\d+\)\s/, "");

                      return (
                        <TableRow
                          key={idx}
                          className="text-sm text-darkBlack700 font-medium"
                        >
                          <TableCell>{idx + 1}.</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                defaultValue={risk}
                                onChange={(e) =>
                                  updateRisk(
                                    idx,
                                    "Risk" || "Risks",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              risk
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Select
                                defaultValue={impactLevel}
                                onValueChange={(
                                  value: "Low" | "Medium" | "High"
                                ) => {
                                  updateRisk(
                                    idx,
                                    "Impact Level" || "Impact level",
                                    value
                                  );
                                }}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Impact Level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Low">Low</SelectItem>
                                  <SelectItem value="High">High</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <div
                                style={{
                                  background: `${levels[impactLevel]}`,
                                }}
                                className="rounded-full w-3 h-3"
                              />
                            )}
                          </TableCell>
                          {isEditing && (
                            <TableCell>
                              <Trash
                                className="text-rose-500 w-5 h-5 cursor-pointer"
                                onClick={() => {
                                  handleRiskDelete(idx);
                                }}
                              />
                            </TableCell>
                          )}
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
