import TFIDFLayout from "@/components/tfidf/tfidfLayout";
import { TitlesProvider } from "@/context/movieTitlesContext";
import { getTitles } from "@/services/movies";

const TFIDF = async () => {
  // const titles = await getTitles();
  return (
    <>
      {/* <TitlesProvider initialTitles={titles}> */}
      <TFIDFLayout />
      {/* </TitlesProvider> */}
    </>
  );
};

export default TFIDF;
