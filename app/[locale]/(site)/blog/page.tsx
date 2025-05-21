import { getPosts } from "@/sanity/sanity-utils";
import BlogItem from "@/components/Blog";

export default async function Home() {
  try {
    const posts = await getPosts();
    
    if (!posts) {
      return <div className="py-5">Loading...</div>;
    }

    return (
      <div className="py-5">
        {posts?.length > 0 ? (
          posts.map((post: any, i) => <BlogItem key={i} blog={post} />)
        ) : (
          <p>No posts found</p>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return <div className="py-5">Error loading posts. Please try again later.</div>;
  }
}