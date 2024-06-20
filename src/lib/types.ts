export interface Blog {
   id: number;
  title: string;
  description: string;
  content: string;
  category_id: number;
  category: string;
}

export interface Category {
  id: number;
  category: string;
}