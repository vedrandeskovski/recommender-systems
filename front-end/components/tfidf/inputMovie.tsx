"use client";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useEffect, useRef, useState } from "react";
import { getMovieByTitle, getTitles } from "@/services/movies";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Divider } from "@heroui/divider";
import { Movie, PaginatedMovies, TitlesResponse } from "@/types/movies";
import { NumberInput } from "@heroui/number-input";
import { getTFIDFRecommendation } from "@/services/tfidf";
import { useTitles } from "@/context/movieTitlesContext";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";

interface InputMovieProps {
  setMovie: React.Dispatch<React.SetStateAction<Movie | undefined>>;
  movie: Movie | undefined;
  setData: React.Dispatch<React.SetStateAction<PaginatedMovies | undefined>>;
  page: number;
  data: PaginatedMovies | undefined;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const InputMovie = ({
  setMovie,
  movie,
  setData,
  page,
  data,
  setPage,
}: InputMovieProps) => {
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<boolean>(false);
  const [movieLoading, setMovieLoading] = useState<boolean>(false);
  const [numRecommendations, setNumRecommendations] = useState<number>(5);
  //const items = useTitles();
  const [items, setItems] = useState<TitlesResponse[]>([]);

  const columns = [
    { key: "movieId", label: "MOVIE ID" },
    { key: "title", label: "TITLE" },
    { key: "year", label: "YEAR" },
    { key: "keywords", label: "KEYWORDS" },
  ];

  const fetchMovie = async () => {
    if (!title.trim()) {
      setTitleError(true);
      setMovie(undefined);
      return;
    }
    setMovieLoading(true);
    setMovie(await getMovieByTitle(title));
    setData(undefined);
    setNumRecommendations(5);
    setMovieLoading(false);
  };

  const onTFIDFClick = async () => {
    setPage(1);
    setMovieLoading(true);
    const data = await getTFIDFRecommendation(
      movie!.title,
      numRecommendations,
      1,
      10
    );
    setData(data);
    setMovieLoading(false);
  };

  useEffect(() => {
    if (!movie) {
      return;
    }
    const fetchRecommendations = async () => {
      setMovieLoading(true);
      const result = await getTFIDFRecommendation(
        movie.title,
        numRecommendations,
        page,
        10
      );
      setData(result);
      setMovieLoading(false);
    };

    fetchRecommendations();
  }, [page]);

  useEffect(() => {
    if (title.length < 3) return;

    const controller = new AbortController();
    const delay = setTimeout(async () => {
      const results = await getTitles(title, { signal: controller.signal });
      setItems(results);
    }, 500);

    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [title]);

  return (
    <>
      <div className="flex items-start gap-x-3">
        <Autocomplete
          value={title}
          allowsCustomValue={true}
          onInputChange={(val) => {
            setTitleError(false);
            setTitle(val);
          }}
          defaultItems={items}
          className="max-w-xl"
          label="Title"
          placeholder="Start searching a title"
          type="text"
          isInvalid={titleError}
          errorMessage="Please enter a valid title"
          size="lg"
          maxListboxHeight={300}
        >
          {(item) => (
            <AutocompleteItem key={item.id}>{item.title}</AutocompleteItem>
          )}
        </Autocomplete>

        <Button className="mt-3" color="secondary" onPress={fetchMovie}>
          Fetch
        </Button>

        {movieLoading && <Spinner color="secondary" />}
      </div>

      {movie && (
        <div className="flex flex-col gap-y-3">
          <Divider />
          <div className="flex items-center gap-x-3">
            <Table layout="fixed" aria-label="Movie table" isStriped={true}>
              <TableHeader columns={columns}>
                {(c) => (
                  <TableColumn key={c.key} className="text-lg">
                    {c.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody emptyContent={movie.errorMsg}>
                {!movie.error
                  ? [
                      <TableRow key={movie.movieId}>
                        {columns.map((c) => (
                          <TableCell key={c.key}>
                            <div className="text-base break-words">
                              {getKeyValue(movie, c.key) ?? "/"}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>,
                    ]
                  : []}
              </TableBody>
            </Table>
            {!movie.error && (
              <>
                <div className="flex flex-col-reverse gap-y-3 w-75">
                  <Button size="lg" color="secondary" onPress={onTFIDFClick}>
                    Recommend
                  </Button>
                  <NumberInput
                    aria-label="Number of recommendations"
                    value={numRecommendations}
                    onChange={(value) => setNumRecommendations(Number(value))}
                    placeholder="Number of recommendations"
                    minValue={1}
                  />
                </div>
              </>
            )}
          </div>
          <Divider />
        </div>
      )}
    </>
  );
};

export default InputMovie;
