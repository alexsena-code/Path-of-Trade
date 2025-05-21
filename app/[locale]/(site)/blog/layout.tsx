import { ReactNode } from 'react';
import "@/app/globals.css";

interface BlogLayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="blog-container">
      <div className="py-8">
        <h1 className="blog-title">Blog</h1>
        <div className="blog-content">
          {children}
        </div>
      </div>
    </div>
  );
} 