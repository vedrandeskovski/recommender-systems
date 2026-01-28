export const dynamic = "force-dynamic";

import MoviesClient from "@/components/movies/moviesLayout";
import { getMovies } from "@/services/movies";

const MoviesPage = async () => {
  const data = await getMovies(null, "asc", 1, 10);
  return (
    <>
      <MoviesClient initialData={data} />
    </>
  );
};

export default MoviesPage;
