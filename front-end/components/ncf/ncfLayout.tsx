"use client";
import React, { useEffect, useRef, useState } from "react";
import InputUser from "./inputUser";
import { PaginatedMovies } from "@/types/movies";
import MovieTable from "../table";
import { Spinner } from "@heroui/spinner";

const NCFLayout = () => {
  const [page, setPage] = useState<number>(1);
  const [recommendationData, setRecommendationData] =
    useState<PaginatedMovies>();
  const [loading, setLoading] = useState<boolean>(false);
  const tableRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (recommendationData && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recommendationData]);
  return (
    <>
      <div className="flex flex-col mb-4 gap-y-3">
        <InputUser
          recommendationData={recommendationData}
          predPage={page}
          setRecommendationData={setRecommendationData}
          setLoading={setLoading}
          loading={loading}
        />

        {recommendationData && (
          <>
            <div ref={tableRef}>
              <h1 className="text-6xl my-3 text-center">
                Sorted movies by predicted rating:{" "}
                {loading && <Spinner color="secondary" />}
              </h1>
              <MovieTable
                data={recommendationData}
                movie={recommendationData.items[0]}
                page={page}
                setPage={setPage}
                ncf={true}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NCFLayout;
