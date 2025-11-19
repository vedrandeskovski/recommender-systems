import MoviesClient from "@/components/movies/moviesLayout";
import { getMovies } from "@/services/movies";
import { Spinner } from "@heroui/spinner";

const MoviesPage = async () => {
  const data = await getMovies(null, "asc", 1, 10);
  return (
    <>
      <MoviesClient initialData={data} />
    </>
  );
};

export default MoviesPage;
