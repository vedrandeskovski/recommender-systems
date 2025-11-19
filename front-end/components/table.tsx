"use client";
import { Movie, PaginatedMovies } from "@/types/movies";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import React from "react";

interface MovieTableProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  movie: Movie;
  data: PaginatedMovies;
  ncf?: boolean;
}

const MovieTable = ({ page, setPage, movie, data, ncf }: MovieTableProps) => {
  const columns = [
    { key: "movieId", label: "MOVIE ID" },
    { key: "title", label: "TITLE" },
    ...(movie.rating !== undefined
      ? [{ key: "rating", label: ncf ? "PREDICTED RATING" : "RATING" }]
      : []),
    { key: "year", label: "YEAR" },
    { key: "keywords", label: "KEYWORDS" },
  ];
  const rows = data.items;

  return (
    <>
      <Table
        layout="fixed"
        aria-label="Movies table"
        isStriped={true}
        topContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={data.pages}
              onChange={(p) => {
                setPage(p);
              }}
            />
          </div>
        }
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={data.pages}
              onChange={(p) => {
                setPage(p);
              }}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(c) => (
            <TableColumn key={c.key} className="text-lg">
              {c.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(m) => {
            return (
              <TableRow key={m.movieId}>
                {(cKey) => {
                  return (
                    <TableCell key={cKey}>
                      <div className="text-base break-words">
                        {getKeyValue(m, cKey) ?? "/"}
                      </div>
                    </TableCell>
                  );
                }}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </>
  );
};

export default MovieTable;
