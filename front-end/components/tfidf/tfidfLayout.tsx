"use client";
import { useState } from "react";
import InputMovie from "./inputMovie";
import { Movie, PaginatedMovies } from "@/types/movies";
import MovieTable from "../table";

const TFIDFLayout = () => {
  const [movie, setMovie] = useState<Movie>();
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<PaginatedMovies>();
  return (
    <>
      <div className="flex flex-col mb-4 gap-y-3">
        <InputMovie
          setMovie={setMovie}
          movie={movie}
          setData={setData}
          page={page}
          data={data}
          setPage={setPage}
        />
        {movie && !movie.error && data && (
          <>
            <h1 className="text-6xl my-3 text-center">
              Sorted movies by cosine similarity:
            </h1>
            <MovieTable
              data={data}
              movie={movie}
              page={page}
              setPage={setPage}
            />
          </>
        )}
      </div>
    </>
  );
};

export default TFIDFLayout;
