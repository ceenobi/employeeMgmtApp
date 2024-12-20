import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

export default function Paginate({
  totalPages,
  count,
}: {
  totalPages: number;
  count: number;
}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );

  const handlePageChange = (direction: "next" | "prev" | "first" | "last") => {
    const pageChangeMap: { [key: string]: number } = {
      first: 1,
      last: totalPages,
      prev: Math.max(1, page - 1),
      next: Math.min(totalPages, page + 1),
    };
    const newPage = pageChangeMap[direction];
    if (newPage !== undefined) {
      params.set("page", newPage.toString());
      navigate(window.location.pathname + "?" + params.toString());
    }
  };

  return (
    <div className="flex justify-end items-center">
      <Pagination
        pageSize={count}
        total={totalPages * count}
        current={page}
        showTitle={true}
        showPrevNextJumpers={true}
        onChange={(newPage) => {
          if (newPage < page) {
            handlePageChange("prev");
          } else if (newPage > page) {
            handlePageChange("next");
          }
        }}
      />
    </div>
  );
}
