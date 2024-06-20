import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { Category } from "@/lib/types";
import { fetchCategories } from "@/lib/fetchCategories";

const NewBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newBlog = {
      title,
      description,
      content,
      category_id: selectedCategory,
    };
    console.log(newBlog);

    try {
      const res = await fetch("http://localhost:4000/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBlog),
      });

      if (!res.ok) {
        throw new Error("Failed to create blog");
      }

      const createdBlog = await res.json();
      console.log("Blog created successfully:", createdBlog);
      router.push("/");
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8"
      >
        <h2 className="text-2xl font-semibold mb-4">Create New Blog</h2>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-semibold mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-semibold mb-2"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-gray-700 font-semibold mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 h-48"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 font-semibold mb-2"
          >
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
            required
          >
            <option value="" disabled>
              Select a category:
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default NewBlog;
