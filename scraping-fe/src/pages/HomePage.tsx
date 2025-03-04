import { useMediaSearch } from "@/hooks";
import { DataTable, SearchBar, UrlForm } from "@/components/ui";
import { PaginationTable } from "@/components/ui";
import { PAGE_SIZE } from "@/constants";

export const HomePage = () => {
  const {
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
  } = useMediaSearch();

  const handleChangePage = (newPage: number) => {
    if (newPage < 0 || newPage >= Math.ceil(totalRecords / PAGE_SIZE)) return;
    setPage(newPage);
  };

  return (
    <>
      <section>
        <UrlForm url={url} setUrl={setUrl} handleScrap={handleScrap} />
      </section>

      <section>
        <div className="w-2/3 mx-auto flex justify-between items-end">
          <SearchBar
            txtSearch={txtSearch}
            setTxtSearch={setTxtSearch}
            handleSearch={handleSearch}
          />
        </div>
        <DataTable data={dataTable} />
      </section>
      <section>
        <div className="mt-10">
          <PaginationTable
            currentPage={page}
            totalRecord={totalRecords}
            pageSize={PAGE_SIZE}
            onChangePage={handleChangePage}
          />
        </div>
      </section>
    </>
  );
};
