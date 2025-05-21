import React from "react";
import { getPostBySlug, getRelatedPosts } from "@/sanity/sanity-utils";
import RenderBodyContent from "@/components/Blog/RenderBodyContent";
import RelatedPosts from "@/components/Blog/RelatedPosts";
import { Blog } from "@/types/blog";

const SingleBlogPage = async ({ params }: { params: any }) => {
  const post = await getPostBySlug(params.slug);
  const relatedPosts: Blog[] = await getRelatedPosts(params.slug);

  console.log('Related Posts:', relatedPosts); // Debug log

  return (
    <article className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-8">
          <time className="text-sm">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <span className="text-sm">•</span>
          <span className="text-sm">By {post.author.name}</span>
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {post.metadata}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <RenderBodyContent post={post} />
      </div>

      {relatedPosts.length > 0 && (
        <RelatedPosts posts={relatedPosts} />
      )}
    </article>
  );
};

export default SingleBlogPage;