"use client";
import React, { FC, useCallback, useEffect, useState } from "react";
import { tableDataProps } from "./home";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { GET_PDF_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import TableSkeletonLoader from "../table-skeleton";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

interface listingTableProps {
  tableData: tableDataProps[];
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const ListingTable: FC<listingTableProps> = ({
  tableData,
  isLoading,
  setIsLoading,
}) => {
  const [paginatedData, setPaginatedData] = useState<tableDataProps[]>([]);
  const [statuses, setStatuses] = useState<{ [key: string]: string }>({});
  const limit = 10;
  const totalPages = Math.ceil(tableData.length / limit);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIdx, setCurrentIdx] = useState(0);
  const router = useRouter();

  console.log(statuses);

  useEffect(() => {
    setIsLoading(true);
    const lowerLimit = (currentPage - 1) * limit;
    const upperLimit = currentPage * limit;
    const singlePageData = tableData.slice(lowerLimit, upperLimit);
    setIsLoading(false);
    setPaginatedData(singlePageData);
  }, [currentPage, setIsLoading, tableData]);

  useEffect(() => {
    if (currentPage) {
      const fetchStatuses = async () => {
        const statusPromises = paginatedData.map((item) =>
          axios
            .get(`${GET_PDF_STATUS}/${item._id}`)
            .then((response) => ({
              id: item._id,
              status: response.data.Status,
            }))
            .catch((error) => ({
              id: item._id,
              status: "Failed",
            }))
        );

        try {
          const statusResults = await Promise.allSettled(statusPromises);
          const newStatuses: { [key: string]: string } = {};
          statusResults.forEach((result) => {
            if (result.status === "fulfilled") {
              newStatuses[result.value.id] = result.value.status;
            } else {
              newStatuses[result.reason.id] = "Cannot get status";
            }
          });
          setStatuses(newStatuses);
        } catch (error) {
          console.error("Error fetching statuses", error);
        }
      };

      if (paginatedData.length > 0) {
        setTimeout(() => {
          fetchStatuses();
        }, 3000);
      }
    }
  }, [currentPage, paginatedData]);

  const { toast } = useToast();

  console.log(statuses);
  const handleClick = useCallback(
    (id: string, status: string) => {
      if (status === "Pending" || status === "Processing") {
        return toast({
          title: "Pdf is processing...",
        });
      }

      router.push(`/process/${id}`);
    },
    [router, toast]
  );

  if (isLoading && tableData.length === 0) {
    return <TableSkeletonLoader />;
  }
  return (
    <div className="max-w-7xl m-auto flex flex-col space-y-6">
      <Table>
        <TableHeader className="bg-lightWhite300 text-darkBlack700 font-semibold text-sm rounded-md">
          <TableRow>
            <TableHead>PID</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item, idx) => (
            <TableRow
              key={idx}
              onClick={() => handleClick(item._id, statuses[item._id])}
              className="text-sm text-darkBlack600 font-normal"
            >
              <TableCell className="text-sdzBlue800 cursor-pointer">
                {item._id}
              </TableCell>
              <TableCell>{item.file_name}</TableCell>
              <TableCell>{statuses[item._id] || "Loading..."}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center gap-2 w-full ml-auto justify-end">
        {Array.from({ length: totalPages }, (_, index) => (
          <span
            key={index}
            onClick={() => {
              setCurrentIdx(index);
              setCurrentPage(index + 1);
            }}
            className={cn(
              "bg-lightWhite400 cursor-pointer text-sdzBlue800 p-2 rounded-md",
              currentIdx === index && "bg-sdzBlueInteractive text-lightWhite400"
            )}
          >
            {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ListingTable;
