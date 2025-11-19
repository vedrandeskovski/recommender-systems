export interface Movie{
    movieId: number;
    title: string;
    year: number | null;
    keywords: string;
    rating?: number;
    error?: boolean;
    errorMsg?: string;
}

export interface PaginatedMovies{
    items: Movie[];
    total: number;
    page: number;
    size: number;
    pages: number;
    error?: boolean;
    errorMsg?: string;
}

export interface TitlesResponse{
    id: number,
    title: string,
}
