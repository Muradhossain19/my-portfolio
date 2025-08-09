export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  likes: number;

  tags: string[];
  featured: boolean;
  metaDescription: string;
  tableOfContents?: Array<{
    id: string;
    title: string;
    level: number;
  }>;
}

// Extended Blog Data with full content
export const blogData: BlogPost[] = [
  {
    id: 1,
    title: "10 Essential Web Development Tools for 2024",
    slug: "10-essential-web-development-tools-for-2024",
    excerpt:
      "Discover the most powerful tools that every web developer should know to boost productivity and create amazing websites.",
    content: `
      <p>In today's rapidly evolving web development landscape, having the right tools can make the difference between struggling with mundane tasks and building incredible digital experiences efficiently. As we progress through 2024, new tools have emerged while established ones have evolved to meet modern development needs.</p>

      <h2>1. Visual Studio Code - The Developer's Best Friend</h2>
      <p>Visual Studio Code remains the most popular code editor among developers, and for good reason. Its extensive ecosystem of extensions, integrated terminal, and excellent Git integration make it indispensable for modern web development.</p>

      <h3>Key Features:</h3>
      <ul>
        <li>IntelliSense code completion</li>
        <li>Built-in Git integration</li>
        <li>Extensive extension marketplace</li>
        <li>Integrated debugging</li>
        <li>Live Share collaboration</li>
      </ul>

      <h2>2. Figma - Design to Development Bridge</h2>
      <p>Figma has revolutionized how designers and developers collaborate. Its web-based interface and real-time collaboration features make it essential for modern web development workflows.</p>

      <h2>3. Chrome DevTools - Debugging Powerhouse</h2>
      <p>Chrome's built-in developer tools have become increasingly sophisticated, offering advanced debugging, performance profiling, and accessibility auditing capabilities.</p>

      <h2>4. GitHub Copilot - AI-Powered Coding Assistant</h2>
      <p>GitHub Copilot uses artificial intelligence to suggest code completions and entire functions, significantly speeding up development time and helping developers learn new patterns.</p>

      <h2>5. Vite - Lightning Fast Build Tool</h2>
      <p>Vite has gained massive popularity due to its incredibly fast development server and optimized build process, making it a go-to choice for modern JavaScript frameworks.</p>

      <h2>Conclusion</h2>
      <p>These tools represent just the beginning of what's possible in modern web development. The key is to choose tools that enhance your workflow and help you build better applications more efficiently. Stay curious, keep experimenting, and always be ready to adapt to new technologies that can improve your development process.</p>
    `,
    image: "/images/blog/blog.jpg",
    category: "Web Development",
    author: "Murad Hossain",
    date: "March 15, 2024",
    readTime: "5 min read",
    likes: 245,

    tags: ["JavaScript", "Tools", "Productivity"],
    featured: true,
    metaDescription:
      "Discover the most powerful web development tools for 2024 that every developer should know to boost productivity and create amazing websites.",
    tableOfContents: [
      { id: "visual-studio-code", title: "Visual Studio Code", level: 2 },
      { id: "figma", title: "Figma", level: 2 },
      { id: "chrome-devtools", title: "Chrome DevTools", level: 2 },
      { id: "github-copilot", title: "GitHub Copilot", level: 2 },
      { id: "vite", title: "Vite", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 },
    ],
  },
  {
    id: 2,
    title: "The Future of WordPress: Headless CMS Approach",
    slug: "the-future-of-wordpress-headless-cms-approach",
    excerpt:
      "Learn how headless WordPress is revolutionizing content management and why it's the future of web development.",
    content: `
      <p>WordPress has been the backbone of the web for over a decade, powering more than 40% of all websites. However, as development practices evolve and user expectations grow, traditional WordPress architecture is being challenged by a new approach: headless WordPress.</p>

      <h2>What is Headless WordPress?</h2>
      <p>Headless WordPress decouples the content management backend from the frontend presentation layer. Instead of using PHP-based themes, developers use WordPress purely as a content management system and build the frontend using modern JavaScript frameworks like React, Vue, or Next.js.</p>

      <h2>Benefits of Headless WordPress</h2>
      
      <h3>1. Performance Improvements</h3>
      <p>By separating the frontend from the backend, headless WordPress sites can leverage modern build tools, CDNs, and static site generation for lightning-fast loading times.</p>

      <h3>2. Enhanced Security</h3>
      <p>With the frontend and backend separated, the attack surface is significantly reduced. The WordPress admin area can be completely hidden from public access.</p>

      <h3>3. Developer Experience</h3>
      <p>Developers can use modern development tools and frameworks they're comfortable with, while content creators can continue using the familiar WordPress interface.</p>

      <h2>Popular Headless WordPress Solutions</h2>
      <ul>
        <li><strong>WPGraphQL:</strong> Adds GraphQL API to WordPress</li>
        <li><strong>REST API:</strong> WordPress's built-in REST API</li>
        <li><strong>Frontity:</strong> React-based framework for WordPress</li>
        <li><strong>Gatsby:</strong> Static site generator with WordPress integration</li>
      </ul>

      <h2>Challenges and Considerations</h2>
      <p>While headless WordPress offers many benefits, it's not without challenges:</p>
      <ul>
        <li>Increased complexity for non-technical users</li>
        <li>Loss of real-time preview functionality</li>
        <li>Additional hosting and development costs</li>
        <li>Plugin compatibility issues</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Headless WordPress represents the evolution of content management, offering the flexibility of modern development practices while maintaining the content management capabilities that made WordPress popular.</p>
    `,
    image: "/images/blog/blog.jpg",
    category: "WordPress",
    author: "Murad Hossain",
    date: "March 10, 2024",
    readTime: "7 min read",
    likes: 189,

    tags: ["WordPress", "Headless", "CMS"],
    featured: false,
    metaDescription:
      "Learn how headless WordPress is revolutionizing content management and why it's the future of web development.",
  },
  {
    id: 3,
    title: "Building Responsive E-commerce Sites: Best Practices",
    slug: "building-responsive-ecommerce-sites-best-practices",
    excerpt:
      "Master the art of creating mobile-first e-commerce websites that convert visitors into customers.",
    content: `
      <p>E-commerce has become increasingly mobile-first, with over 70% of online shopping now happening on mobile devices. Creating responsive e-commerce sites that provide excellent user experience across all devices is no longer optional—it's essential for business success.</p>

      <h2>Mobile-First Design Strategy</h2>
      <p>Starting with mobile design ensures that your core functionality works perfectly on the most constrained screen sizes before scaling up to larger devices.</p>

      <h3>Key Mobile Considerations:</h3>
      <ul>
        <li>Touch-friendly interface elements</li>
        <li>Fast loading times</li>
        <li>Simplified navigation</li>
        <li>Easy checkout process</li>
      </ul>

      <h2>Performance Optimization</h2>
      <p>Page speed directly impacts conversion rates. Every second of delay can result in a 7% reduction in conversions.</p>

      <h3>Essential Optimizations:</h3>
      <ul>
        <li>Image optimization and lazy loading</li>
        <li>Minified CSS and JavaScript</li>
        <li>Content Delivery Network (CDN) implementation</li>
        <li>Database query optimization</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Building successful responsive e-commerce sites requires careful attention to performance, user experience, and mobile optimization.</p>
    `,
    image: "/images/blog/blog.jpg",
    category: "E-commerce",
    author: "Murad Hossain",
    date: "March 5, 2024",
    readTime: "6 min read",
    likes: 312,

    tags: ["E-commerce", "Responsive", "UX"],
    featured: true,
    metaDescription:
      "Master the art of creating mobile-first e-commerce websites that convert visitors into customers.",
  },
];

// Helper functions
export const getBlogPostBySlug = (slug: string): BlogPost | null => {
  return blogData.find((post) => post.slug === slug) || null;
};

export const getRelatedPosts = (
  currentPostId: number,
  category: string,
  limit: number = 3
): BlogPost[] => {
  return blogData
    .filter((post) => post.id !== currentPostId && post.category === category)
    .slice(0, limit);
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
