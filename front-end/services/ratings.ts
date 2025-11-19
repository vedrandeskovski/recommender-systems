import { PaginatedMovies } from "@/types/movies";
import { API_URL } from "./config";

export async function getRatingsForUser(userId: number, sort_by: string | null, order: string | null, page: number, size: number):Promise<PaginatedMovies>{
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
    const url = `${API_URL}/users/${userId}/ratings?${params.toString()}`
    try{
        const result = await fetch(url, {cache: "no-store"})
        if (!result.ok){
            const data = await result.json()
            return { items: [], total: 0, page, size, pages: 0, error: true , errorMsg: data.detail}
        }
        return result.json()
    }catch (error) {
        console.error("Error fetching ratings:", error);
        return { items: [], total: 0, page, size, pages: 0, error: true, errorMsg: "Services currently unnavailable." }
  }
}

export async function isUserTrained(userId: number):Promise<boolean>{
    const url = `${API_URL}/users/${userId}/is_trained`
    try{
        const result = await fetch(url, {cache: "no-store"})
        if (!result.ok){
            console.error("Error checking trained user:", result.statusText);
            return false;
        }
        return result.json()
    }
    catch(error){
        console.error("Error checking trained user:", error);
        return false;
    }
}