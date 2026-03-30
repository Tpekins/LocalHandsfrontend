import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../../utils/blogData';
import Card from '../../components/Card';
import Button from '../../components/Button';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold font-poppins text-red-600">Post not found</h1>
        <p className="text-gray-600 mt-4">Sorry, we couldn't find the blog post you're looking for.</p>
        <Link to="/blog" className="mt-8 inline-block">
            <Button variant="primary">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <Card className="p-8 md:p-12 shadow-lg">
          <article>
            <header className="mb-8 border-b pb-4">
              <h1 className="text-4xl md:text-5xl font-bold font-poppins text-gray-800 leading-tight">{post.title}</h1>
              <p className="text-gray-500 text-md mt-4">By {post.author} on {post.date}</p>
            </header>
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </Card>
        <div className="text-center mt-12">
            <Link to="/blog">
                <Button variant="secondary">Back to All Posts</Button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
