import { getPostsByCategoryAndGameVersion } from "@/sanity/sanity-utils";
import BlogItem from "@/components/Blog";
import { Blog } from "@/types/blog";

interface GameVersionPostsProps {
  category: string;
  gameVersion: string;
  locale: string;
}

export default async function GameVersionPosts({
  category,
  gameVersion,
  locale,
}: GameVersionPostsProps) {
  try {

    const posts = await getPostsByCategoryAndGameVersion(
      category,
      gameVersion,
      locale
    );


    return (
      <div className="py-5">
        <h2 className="text-4xl font-bold">Latest News</h2>
        {posts?.length > 0 ? (
          posts.map((post: Blog) => (
            <BlogItem
              key={`${post._id}-${post.slug.current}`}
              blog={post}
              locale={locale}
            />
          ))
        ) : (
          <p>No posts found for this category and game version</p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <div className="py-5">Error loading posts. Please try again later.</div>
    );
  }
}
