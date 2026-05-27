import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../utils/blogData';

const BlogPage: React.FC = () => {
  

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-poppins text-gray-800">From the Blog</h1>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-gray-50 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold font-poppins text-gray-800 mb-2">{post.title}</h2>
              <p className="text-gray-500 text-sm mb-4">By {post.author} on {post.date}</p>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="text-primary font-semibold hover:underline">Read More</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
