import { useCallback, useEffect, useState } from "react";
import { MEDIA_URL, PAGE_SIZE, SCRAP_URL } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { notifyError } from "@/lib/notify";
import { useLoading } from "./useLoading";

export const useMediaSearch = () => {
  const [dataTable, setDataTable] = useState<IDataTables[]>([]);
  const [url, setUrl] = useState<string>("");
  const [txtSearch, setTxtSearch] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const { user } = useAuth();
  const { setLoading } = useLoading();

  const handleSearch = useCallback(async () => {
    try {
      const params = {
        type: "url",
        searchText: txtSearch,
        page: String(page + 1),
        limit: String(PAGE_SIZE),
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${MEDIA_URL}?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      });

      const res = await response.json();
      console.log(res);
      setDataTable(res.data?.results);
      setTotalRecords(res.data?.totalRecords);
    } catch (error: any) {
      notifyError(error.message);
    }
  }, [txtSearch, page, user]);

  useEffect(() => {
    handleSearch();
  }, [page, handleSearch]);

  // Set up interval to refresh data every 5 seconds
  useEffect(() => {
    // const intervalId = setInterval(() => {
    //   handleSearch();
    // }, 3000);
    // // Clear the interval on component unmount
    // return () => clearInterval(intervalId);
  }, [handleSearch]);

  const handleScrap = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(SCRAP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify({ url }),
      });
      const res = await response.json();
      if (res.status === 200) {
        setUrl("");
      }
      handleSearch();
    } catch (error: any) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  }, [url, user]);

  return {
    dataTable,
    url,
    setUrl,
    txtSearch,
    setTxtSearch,
    page,
    setPage,
    totalRecords,
    handleScrap,
    handleSearch,
  };
};
