import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { Blog } from "../lib/types";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const recentBlog: Blog[] = blogs.slice(0, 5);

  useEffect(() => {
    fetch("http://localhost:4000/api/blogs")
      .then((response) => response.json())
      .then((data) => setBlogs(data));
  }, []);

  return (
    <main className="container mx-auto mt-8 px-10">
      <h1 className="text-3xl font-bold mb-4">Recent Blogs</h1>
      {recentBlog.map((blog) => (
        <div key={blog.id} className="border-b py-4">
          <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
          <p className="text-gray-600 mb-2">{blog.description}</p>
          <p className="text-gray-500 mb-4">Category: {blog.category}</p>
          <Link
            href={`/blog/${blog.id}`}
            className="text-blue-600 hover:underline"
          >
            Read More
          </Link>
        </div>
      ))}
    </main>
  );
}
