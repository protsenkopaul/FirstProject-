import type { Author } from "./authorController.js";
import { readJson, writeJson } from "../db.js";


const FILE = "posts.json";
export type Post = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
};

export async function createPost(authorId: string, title: string, content: string): Promise<Post> {
  const posts = await readJson<Post>(FILE);
  const newPost: Post = {
    id: crypto.randomUUID(),
    authorId,
    title,
    content,
    createdAt: new Date().toISOString(),
    likes: 0
  };
  posts.push(newPost);
  await writeJson(FILE, posts);
  return newPost;
}

export async function getFeed(authorId: string): Promise<Post[]> {
  const posts = await readJson<Post>(FILE);
  const authors = await readJson<Author>("authors.json");
  const author = authors.find((a: Author) => a.id === authorId);
  if (!author) throw new Error("Author not found");

  return posts.filter((p) => author.following.includes(p.authorId));
}