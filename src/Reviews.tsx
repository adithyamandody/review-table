import { Box, Title } from "@mantine/core";
import { ConstructorFragment } from "ethers";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import useReviews, { Review } from "./useReviews";

const PAGE_SIZES = [10, 15, 20];

export default function Reviews() {
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [page, setPage] = useState(1);

  const { reviews, reviewCount } = useReviews();
  const { data, isLoading, isError } = reviews(page);
  const { data: count, isLoading: rLoading } = reviewCount();

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  return (
    <Box p={20}>
      <Title>Reviews</Title>
      <Box sx={{ height: 300, maxWidth: 650 }}>
        <DataTable<Review>
          withBorder
          records={data}
          columns={[
            { accessor: "address", width: "50%" },
            { accessor: "review", width: "50%" },
          ]}
          totalRecords={Number(count) ?? 0}
          fetching={isLoading}
          paginationColor="grape"
          recordsPerPage={pageSize}
          page={page}
          onPageChange={(p) => setPage(p)}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
        />
      </Box>
    </Box>
  );
}
