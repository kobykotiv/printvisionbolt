import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface BlogPost {
  title: string;
  slug: string;
  date: string;
  content: string;
}

export function Blog() {
  const { slug } = useParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Dynamic import all markdown files from the blog directory
    const loadPosts = async () => {
      const postModules = import.meta.glob('/src/blog/*.md', { as: 'raw' });
      const loadedPosts: BlogPost[] = [];

      for (const [path, loader] of Object.entries(postModules)) {
        const content = await loader();
        const slug = path.replace('/src/blog/', '').replace('.md', '');
        const title = content.split('\n')[0].replace('# ', '');
        const date = content.split('\n')[1].replace('Date: ', '');
        
        loadedPosts.push({ title, slug, date, content });
      }

      setPosts(loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      
      if (slug) {
        const post = loadedPosts.find(p => p.slug === slug);
        setCurrentPost(post || null);
      }
    };

    loadPosts();
  }, [slug]);

  if (slug && currentPost) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/blog" className="text-blue-500 hover:underline mb-4 block">← Back to all posts</Link>
        <article className="prose">
          <div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Print on Demand Tutorials</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.slug} className="border-b pb-6">
            <Link to={`/blog/${post.slug}`} className="block">
              <h2 className="text-xl font-semibold hover:text-blue-500">{post.title}</h2>
              <p className="text-gray-500 text-sm">{post.date}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
