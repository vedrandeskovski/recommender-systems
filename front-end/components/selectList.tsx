"use client";
import { Movie, PaginatedMovies } from "@/types/movies";
import { Select, SelectItem } from "@heroui/select";

interface SelectListProps {
  sortBy: string | null;
  order: string | null;
  size: number;
  setSortBy: React.Dispatch<React.SetStateAction<string | null>>;
  setOrder: React.Dispatch<React.SetStateAction<string | null>>;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  movie: Movie;
}

const SelectLists = ({
  setSortBy,
  setOrder,
  setSize,
  movie,
  sortBy,
  order,
  size,
}: SelectListProps) => {
  const options = [
    { key: "", label: "/" },
    { key: "title", label: "title" },
    { key: "year", label: "year" },
    ...(movie.rating !== undefined ? [{ key: "rating", label: "rating" }] : []),
  ];

  return (
    <>
      <Select
        label="Sort by"
        placeholder="Select a sort by"
        selectedKeys={sortBy ? new Set([sortBy]) : new Set()}
        onSelectionChange={(key) => {
          const value = key.anchorKey ?? "";
          setSortBy(value === "" ? null : value);
        }}
      >
        {options.map((val) => {
          return (
            <SelectItem key={val.key}>{val.label.toUpperCase()}</SelectItem>
          );
        })}
      </Select>

      <Select
        label="Order"
        placeholder="Select an order"
        selectedKeys={order ? new Set([order]) : new Set()}
        onSelectionChange={(key) => {
          const value = key.anchorKey ?? "";
          setOrder(value === "" ? null : value);
        }}
      >
        <SelectItem key={"asc"}>Ascending</SelectItem>
        <SelectItem key={"desc"}>Descending</SelectItem>
      </Select>

      <Select
        label="Size"
        placeholder="Select a page size"
        selectedKeys={String(size) ? new Set([String(size)]) : new Set()}
        onSelectionChange={(key) => {
          const value = key.anchorKey ?? 10;
          setSize(Number(value) || 10);
        }}
      >
        {[10, 20, 30, 40, 50].map((val) => {
          return (
            <SelectItem textValue={val.toString()} key={val}>
              {val}
            </SelectItem>
          );
        })}
      </Select>
    </>
  );
};

export default SelectLists;
