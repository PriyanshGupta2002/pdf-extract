"use client";
import React, { useCallback, useEffect, useState } from "react";
import Header from "./header";
import ListingTable from "./lsiting-table";
import axios from "axios";
import { PDF_LISTING } from "@/lib/constants";

export interface tableDataProps {
  _id: string;
  file_type: string;
  file_name: string;
  file_path: string;
  message: string;
}

const Home = () => {
  const [tableData, setTableData] = useState<tableDataProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchPdfList = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(PDF_LISTING);
      setTableData(data);
    } catch (error) {
      console.log("Error while getting listing", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPdfList();
  }, [fetchPdfList]);

  return (
    <div className="space-y-5">
      <Header fetchPdfList={fetchPdfList} />
      <ListingTable
        tableData={tableData}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default Home;
