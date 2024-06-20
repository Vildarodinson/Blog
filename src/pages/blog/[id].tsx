import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Blog, Category } from "@/lib/types";

const BlogPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");
  const [editedCategory, setEditedCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/blogs/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch blog");
        }
        const data: Blog = await res.json();
        setBlog(data);
        setEditedTitle(data.title);
        setEditedDescription(data.description);
        setEditedContent(data.content);
        setEditedCategory(data.category);
        const wordCount = data.content.split(/\s+/).length;
        setWordCount(wordCount);
        console.log(data.category);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/categories");
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (id) {
      fetchBlog();
      fetchCategories();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!id) {
      console.error("No blog ID found for deletion");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete blog");
      }

      console.log("Blog deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const editedBlog = {
      id: blog?.id,
      title: editedTitle,
      description: editedDescription,
      content: editedContent,
      category_id: editedCategory,
    };

    try {
      const res = await fetch(`http://localhost:4000/api/blogs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedBlog),
      });

      if (!res.ok) {
        throw new Error("Failed to update blog");
      }

      const updatedBlog: Blog = await res.json();
      setBlog(updatedBlog);
      setIsEditing(false);
      router.push(`/`);
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8 px-10">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
            <h1 className="text-3xl font-bold">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
                required
              />
            </h1>
          ) : (
            <h1 className="text-3xl font-bold">{blog.title}</h1>
          )}
          <div>
            {!isEditing && (
              <button
                onClick={handleEditToggle}
                className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm mr-2"
              >
                Edit
              </button>
            )}
            {isEditing && (
              <button
                onClick={handleEditSubmit}
                className="bg-green-500 text-white px-2 py-1 rounded-md text-sm mr-2"
              >
                Save
              </button>
            )}
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
            >
              Delete
            </button>
          </div>
        </div>
        {!isEditing && (
          <>
            <p className="text-xl mb-2">{blog.description}</p>
            <p className="text-gray-600 pb-2 border-b">
              Word Count: {wordCount}
            </p>
            <p className="my-8 text-lg">{blog.content}</p>
            <p className="text-gray-600">Category: {blog.category}</p>
          </>
        )}
        {isEditing && (
          <form onSubmit={handleEditSubmit} className="mb-4">
            <div className="mb-4">
              <label
                htmlFor="editedDescription"
                className="block text-gray-700 font-semibold mb-2"
              >
                Description
              </label>
              <input
                type="text"
                id="editedDescription"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="editedContent"
                className="block text-gray-700 font-semibold mb-2"
              >
                Content
              </label>
              <textarea
                id="editedContent"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 h-48"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                htmlFor="editedCategory"
                className="block text-gray-700 font-semibold mb-2"
              >
                Category
              </label>
              {categories.length > 0 ? (
                <select
                  id="editedCategory"
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category}
                    </option>
                  ))}
                </select>
              ) : (
                <p>Loading categories...</p>
              )}
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mr-2"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleEditToggle}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
