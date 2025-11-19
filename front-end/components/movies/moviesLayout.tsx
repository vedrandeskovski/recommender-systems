"use client";
import React, { useEffect, useRef, useState } from "react";
import { PaginatedMovies } from "@/types/movies";
import { getMovies } from "@/services/movies";

import LoadingComponent from "../loading";
import SelectLists from "../selectList";
import MovieTable from "../table";
import ErrorComponent from "../error";

interface MoviesClientProps {
  initialData: PaginatedMovies;
}

const MoviesClient = ({ initialData }: MoviesClientProps) => {
  const [data, setData] = useState<PaginatedMovies>(initialData);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [order, setOrder] = useState<string | null>("asc");
  const [page, setPage] = useState<number>(initialData.page);
  const [size, setSize] = useState<number>(initialData.size);
  const [loading, setLoading] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const response = await getMovies(sortBy, order, page, size);
      setData(response);
      setLoading(false);
    };

    fetchData();
  }, [sortBy, order, page, size]);

  if (data.error) {
    return <ErrorComponent text="Error fetching data!" />;
  }
  if (loading) {
    return <LoadingComponent text="Loading movies..." />;
  }

  return (
    <>
      <div className="flex justify-center">
        <div className="flex justify-center gap-x-6 mb-4 w-[100vh]">
          <SelectLists
            sortBy={sortBy}
            order={order}
            size={size}
            setSortBy={setSortBy}
            setOrder={setOrder}
            setSize={setSize}
            movie={data.items[0]}
          />
        </div>
      </div>

      <div className="flex flex-col overflow-hidden h-[70vh]">
        <div className="overflow-auto">
          <MovieTable
            page={page}
            setPage={setPage}
            movie={data.items[0]}
            data={data}
          />
        </div>
      </div>
      {/* <div className="grid grid-cols-12 gap-4 h-[75vh] mb-20">
        <div className="col-span-2 flex flex-col gap-4">
          <SelectLists
            sortBy={sortBy}
            order={order}
            size={size}
            setSortBy={setSortBy}
            setOrder={setOrder}
            setSize={setSize}
            movie={data.items[0]}
          />
        </div>

        <div className="col-span-10 flex flex-col h-full overflow-hidden">
          <div className="overflow-auto">
            <MovieTable
              page={page}
              setPage={setPage}
              movie={data.items[0]}
              data={data}
            />
          </div>
        </div>
      </div> */}
    </>
  );
};

export default MoviesClient;
