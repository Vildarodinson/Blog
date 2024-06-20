import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Category, Blog } from "@/lib/types";
import { fetchCategories } from "@/lib/fetchCategories";

const Discover = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    fetch("http://localhost:4000/api/blogs")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched blogs:", data);
        setBlogs(data);
      })
      .catch((error) => console.error("Error fetching blogs:", error));

    fetchCategories()
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const filteredBlog =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory);

  return (
    <div className="container mx-auto mt-8 px-10">
      <h1 className="text-3xl font-bold mb-8">Discover Blogs</h1>
      <div className="mb-8 flex flex-wrap gap-4">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded ${
            selectedCategory === "All"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.category}
            onClick={() => handleCategoryChange(cat.category)}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat.category
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {cat.category}
          </button>
        ))}
      </div>
      <div>
        {filteredBlog.map((blog) => (
          <div key={blog.id} className="pt-8 border-b flex flex-col gap-2">
            <h2 className="text-xl font-semibold ">{blog.title}</h2>
            <p className="text-gray-600 mb-2">{blog.description}</p>
            <p className="text-gray-500 mb-2">Category: {blog.category}</p>
            <Link
              href={`/blog/${blog.id}`}
              className="text-blue-600 hover:underline"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
