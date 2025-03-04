import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui";
import { useEffect, useState } from "react";

type IPaginationTable = {
  currentPage: number;
  totalRecord: number;
  pageSize: number;
  onChangePage: (page: number) => void;
};

export function PaginationTable({
  currentPage,
  totalRecord,
  pageSize,
  onChangePage,
}: IPaginationTable) {
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    setTotalPage(Math.ceil(totalRecord / pageSize));
  }, [totalRecord, pageSize]);

  const handlePrevious = () => {
    if (currentPage > 0) {
      onChangePage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPage - 1) {
      onChangePage(currentPage + 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        {!!totalPage && (
          <>
            <PaginationItem onClick={handlePrevious} className="cursor-pointer">
              <PaginationPrevious />
            </PaginationItem>
            {Array.from({ length: totalPage }, (_, i) => (
              <PaginationItem
                className="cursor-pointer"
                key={i}
                onClick={() => onChangePage(i)}
              >
                <PaginationLink isActive={i === currentPage}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem onClick={handleNext} className="cursor-pointer">
              <PaginationNext />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
