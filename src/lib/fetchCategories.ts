import { Category } from "./types";

export async function fetchCategories(): Promise<Category[]> {
    try {
      const response = await fetch("http://localhost:4000/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data: Category[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }