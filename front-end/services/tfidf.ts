import { PaginatedMovies } from "@/types/movies";
import { API_URL } from "./config";

export async function getTFIDFRecommendation (title: string, numRecommendations: number, page: number, size: number):Promise<PaginatedMovies> {
    const params = new URLSearchParams({
        "title": title,
        "num_recommendations": String(numRecommendations),
        "page": String(page),
        "size": String(size)
    })

    const url = `${API_URL}/tfidf?${params.toString()}`
    try{
        const response = await fetch(url, {cache: "no-cache"})
        if (!response.ok){
            const data = await response.json()
            return { items: [], total: 0, page, size, pages: 0, error: true , errorMsg: data.detail}
        }
        return response.json()
    }
    catch(error){
        return { items: [], total: 0, page, size, pages: 0, error: true , errorMsg: "Services currently unnavailable."}
    }


}