import { Movie, PaginatedMovies, TitlesResponse } from "@/types/movies";
import { API_URL } from "./config";

export async function getMovies(sort_by: string | null, order: string | null, page: number, size: number): Promise<PaginatedMovies>{
    
    const params = new URLSearchParams({
        page: String(page),
        size: String(size)
    })
    if (sort_by){
        params.append("sort_by", sort_by)
        if (order){
            params.append("order", order)
        }
    }

    const url = `${API_URL}/movies?${params.toString()}`
    try{
        const result = await fetch(url, {cache: "no-store"})
        if (!result.ok){
            // throw to server 
            throw new Error(`Failed to fetch movies; status:${result.status}`)
        }
        return result.json()
    }catch (error) {
        console.error("Error fetching movies:", error);
        return { items: [], total: 0, page, size, pages: 0, error: true }
  }

}

export async function getMovieByTitle(title : string): Promise<Movie>{
    const params = new URLSearchParams({
        "title": title
    })
    const url = `${API_URL}/movie_by_title?${params.toString()}`

    try{
        const result = await fetch(url, {cache: "no-store"})
        if (!result.ok){
            const data = await result.json()
            return {movieId: -1, keywords: "", title: "", year: -1, error: true, errorMsg: data.detail}
        }
        return result.json()
    }catch(error){
        console.error("Error fetching movie:", error)
        return {movieId: -1, keywords: "", title: "", year: -1, error: true, errorMsg: "Services currently unnavailable."}
    }
}

export async function getTitles(query: string, options: { signal: AbortSignal }): Promise<TitlesResponse[]>{
    const params = new URLSearchParams({
        "query": query
    })
    const url = `${API_URL}/titles?${params.toString()}`

    try{
        const result = await fetch(url, {cache: "no-store", signal: options.signal})
        
        if (!result.ok){
            throw new Error(`Failed to fetch titles; status ===> ${result.status}`)
        }
        return result.json()
    }catch(error){
        console.error("Error fetching titles ===> ", error)
        return []
    }
}