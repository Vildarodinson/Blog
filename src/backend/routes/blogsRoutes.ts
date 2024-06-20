import express, { Request, Response } from "express";
import { ResultSetHeader , RowDataPacket } from "mysql2";
import pool from "../db";
import { Blog } from "@/lib/types";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT blogs.id, 
             blogs.title, 
             blogs.description, 
             blogs.content, 
             categories.category AS category
      FROM blogs
      LEFT JOIN categories ON blogs.category_id = categories.id
    `;
    const [rows] = (await pool.query(query)) as RowDataPacket[];
    const blogsWithCategoryName = rows.map((row: RowDataPacket) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      category: row.category || "Uncategorized",
    }));
    res.json(blogsWithCategoryName);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT blogs.id,
             blogs.title,
             blogs.description,
             blogs.content,
             categories.category AS category
      FROM blogs
      LEFT JOIN categories ON blogs.category_id = categories.id
      WHERE blogs.id = ?
    `;
    const [rows] = (await pool.query(query, [id])) as RowDataPacket[];
    if (rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(rows[0] as Blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { title, description, content, category_id } = req.body;
  try {
    const query = `
      INSERT INTO blogs (title, description, content, category_id)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [title, description, content, category_id]) as ResultSetHeader[];
    res.status(201).json({ id: result.insertId, title, description, content, category_id });
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const query = "DELETE FROM blogs WHERE id = ?";
    const [result] = await pool.query(query, [id]) as ResultSetHeader[];
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Blog not found" });
    } else {
      res.status(200).json({ message: "Blog deleted successfully" });
    }
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, content, category_id } = req.body;

  try {
    const query = `
      UPDATE blogs
      SET title = ?, description = ?, content = ?, category_id = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(query, [title, description, content, category_id, id]) as ResultSetHeader[];
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    const [updatedBlog] = (await pool.query(`
      SELECT blogs.id,
             blogs.title,
             blogs.description,
             blogs.content,
             categories.category AS category
      FROM blogs
      LEFT JOIN categories ON blogs.category_id = categories.id
      WHERE blogs.id = ?
    `, [id])) as RowDataPacket[];
    res.json(updatedBlog as Blog);
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
