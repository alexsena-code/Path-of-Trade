import { Blog } from "@/types/blog";
import Link from "next/link";
import React from "react";

const BlogItem = ({ blog }: { blog: Blog }) => {
  return (
    <Link
      href={`/blog/${blog.slug.current}`}
      className="block p-6 bg-black rounded-lg border border-gray-600 shadow-lg my-8 transition-all duration-300 hover:shadow-xl hover:border-gray-600 no-underline"
    >
      <article>
        <h3 className="mb-2 text-2xl font-bold tracking-tight text-white hover:text-gray-300 transition-colors">
          {blog.title}
        </h3>
        <p className="mb-3 font-normal text-sm text-gray-400 ">
          {new Date(blog.publishedAt).toDateString()}
        </p>

        <p className="mb-3 font-normal text-gray-300 leading-relaxed">
          {blog.metadata.slice(0, 140)}...
        </p>
      </article>
    </Link>
  );
};

export default BlogItem;