export interface Service {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  hero_description: string;
  overview: string;
  features: string[];
  process: Array<{ title: string; description: string }>;
  benefits: string[];
  technologies: string[];
  portfolio_examples: Array<{
    id: string;
    title: string;
    description: string;
    longDescription: string;
    image: string;
    images?: string[];
    client: string;
    date: string;
    services: string;
    budget: string;
    likes: number;
    link: string;
    features: string[];
  }>;
  pricing: {
    basic: { price: string; features: string[] };
    standard: { price: string; features: string[] };
    premium: { price: string; features: string[] };
  };
  faqs: Array<{ question: string; answer: string }>;
  testimonials: Array<{
    name: string;
    company: string;
    feedback: string;
    rating: number;
  }>;
  why_choose: string[];
  delivery_time: string;
  guarantee: string;
}

export const services: Service[] = [
  {
    slug: "web-development",
    title: "Web Development",
    subtitle:
      "Fast, secure, and beautiful websites designed to grow your business.",
    image: "/images/services/web-development.jpg",
    hero_description:
      "Transform your business with cutting-edge web development solutions. I create fast, responsive, and user-friendly websites that drive results and engage your audience.",
    overview:
      "As a experienced web developer, I specialize in creating custom websites that perfectly align with your business goals. From simple landing pages to complex web applications, I deliver solutions that are not only visually appealing but also technically robust and scalable.",
    features: [
      "Responsive Design (Mobile, Tablet, Desktop)",
      "SEO Optimization & Performance Tuning",
      "Modern Frontend Technologies (React, Next.js)",
      "Backend Development (Node.js, Laravel)",
      "Database Design & Integration",
      "API Development & Third-party Integrations",
      "Content Management System Setup",
      "E-commerce Functionality",
      "Security Implementation",
      "Analytics & Tracking Setup",
      "Cross-browser Compatibility",
      "Progressive Web App (PWA) Features",
    ],
    process: [
      {
        title: "Discovery & Planning",
        description:
          "We start with a comprehensive consultation to understand your business goals, target audience, and project requirements. I analyze your competition and create a detailed project roadmap.",
      },
      {
        title: "Design & Wireframing",
        description:
          "Creating user-friendly wireframes and design mockups that focus on user experience. I ensure the design aligns with your brand identity and business objectives.",
      },
      {
        title: "Development & Testing",
        description:
          "Building your website using modern technologies and best practices. Each feature is thoroughly tested across different devices and browsers to ensure optimal performance.",
      },
      {
        title: "Launch & Optimization",
        description:
          "Deploying your website to production servers, setting up analytics, and providing post-launch support. I also provide training on how to manage your website content.",
      },
    ],
    benefits: [
      "Increase online visibility and reach more customers",
      "Improve user engagement with intuitive design",
      "Boost conversions with optimized user experience",
      "Ensure mobile compatibility for all devices",
      "Achieve faster loading times and better SEO rankings",
      "Get scalable solutions that grow with your business",
      "Receive ongoing support and maintenance",
      "Access to modern technologies and best practices",
    ],
    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Laravel",
      "PHP",
      "MySQL",
      "MongoDB",
      "PostgreSQL",
      "Git",
      "AWS",
      "Vercel",
      "Netlify",
      "Docker",
      "Tailwind CSS",
    ],
    portfolio_examples: [
      {
        id: "web-dev-1",
        title: "E-commerce Fashion Store",
        image: "/images/portfolio/ecommerce-example.jpg",
        images: [
          "/images/portfolio/ecommerce-example.jpg",
          "/images/portfolio/fashion-store.jpg",
        ],
        description:
          "A complete online store with product catalog, payment integration, and order management system.",
        longDescription:
          "Developed a full-featured e-commerce platform for a fashion brand using Next.js and Stripe. The platform includes advanced product filtering, a seamless checkout experience, and a custom admin dashboard for managing orders and inventory.",
        client: "Aura Fashion",
        date: "July 2025",
        services: "Web Development, E-commerce",
        budget: "$7,000",
        likes: 142,
        link: "https://example.com",
        features: [
          "Stripe Payment Gateway Integration",
          "Custom Admin Dashboard",
          "Advanced Product Filtering",
          "Responsive Design",
        ],
      },
      {
        id: "web-dev-2",
        title: "Corporate Business Website",
        image: "/images/portfolio/corporate-example.jpg",
        images: ["/images/portfolio/corporate-example.jpg"],
        description:
          "Professional website with content management system and lead generation forms.",
        longDescription:
          "Created a professional and modern corporate website for a financial consulting firm. The site was built on a headless CMS for easy content updates and optimized for lead generation with integrated forms and CRM.",
        client: "Innovate Finance",
        date: "May 2025",
        services: "Web Design, CMS Integration",
        budget: "$4,500",
        likes: 98,
        link: "https://example.com",
        features: [
          "Headless CMS (Sanity.io)",
          "Lead Generation Forms",
          "Blog and News Section",
          "SEO Optimization",
        ],
      },
      {
        id: "web-dev-3",
        title: "SaaS Application Dashboard",
        image: "/images/portfolio/saas-example.jpg",
        images: [
          "/images/portfolio/saas-example.jpg",
          "/images/portfolio/saas-example-2.jpg",
        ],
        description:
          "Complex dashboard application with user authentication and data visualization.",
        longDescription:
          "Designed and developed a complex SaaS dashboard for a data analytics company. The application features secure user authentication, real-time data visualization with D3.js, and a subscription management system.",
        client: "Data Insights Inc.",
        date: "March 2025",
        services: "SaaS Development, UI/UX Design",
        budget: "$12,000",
        likes: 215,
        link: "https://example.com",
        features: [
          "Real-time Data Visualization",
          "User Authentication (JWT)",
          "Subscription Management",
          "Team Collaboration Tools",
        ],
      },
    ],
    pricing: {
      basic: {
        price: "$500 - $1,500",
        features: [
          "Up to 5 pages",
          "Responsive design",
          "Basic SEO optimization",
          "Contact form integration",
          "1 month support",
        ],
      },
      standard: {
        price: "$1,500 - $3,500",
        features: [
          "Up to 15 pages",
          "Custom design & development",
          "Advanced SEO optimization",
          "CMS integration",
          "E-commerce functionality",
          "3 months support",
        ],
      },
      premium: {
        price: "$3,500 - $8,000+",
        features: [
          "Unlimited pages",
          "Custom web application",
          "Advanced integrations",
          "Performance optimization",
          "Security implementation",
          "6 months support",
          "Ongoing maintenance",
        ],
      },
    },
    faqs: [
      {
        question: "How long does it take to build a website?",
        answer:
          "Typical timelines range from 2-4 weeks for simple websites to 8-12 weeks for complex applications. The exact timeline depends on project scope and requirements.",
      },
      {
        question: "Will my website be mobile-friendly?",
        answer:
          "Absolutely! All websites I build are fully responsive and optimized for mobile devices. I follow mobile-first design principles to ensure the best user experience.",
      },
      {
        question: "Do you provide ongoing support after launch?",
        answer:
          "Yes, I offer various support packages including bug fixes, content updates, security monitoring, and feature enhancements. Support terms vary by project package.",
      },
      {
        question: "Can you help with website hosting and domain setup?",
        answer:
          "I can guide you through hosting and domain selection, and help with the setup process. I work with reliable hosting providers to ensure optimal performance.",
      },
      {
        question: "Will I be able to update content myself?",
        answer:
          "Yes, I can integrate a user-friendly content management system that allows you to easily update text, images, and other content without technical knowledge.",
      },
    ],
    testimonials: [
      {
        name: "Sarah Johnson",
        company: "TechFlow Solutions",
        feedback:
          "Outstanding work! The website exceeded our expectations and helped increase our online conversions by 40%.",
        rating: 5,
      },
      {
        name: "Michael Chen",
        company: "Digital Innovations",
        feedback:
          "Professional, reliable, and delivered exactly what we needed. The project was completed on time and within budget.",
        rating: 5,
      },
      {
        name: "Jessica Lee",
        company: "Creative Minds",
        feedback:
          "The new web application is incredibly fast and user-friendly. Our team's productivity has skyrocketed. Highly recommended!",
        rating: 5,
      },
      {
        name: "Tom Williams",
        company: "Growth Partners",
        feedback:
          "A true professional who understands modern web standards. The final product was pixel-perfect and performs flawlessly on all devices.",
        rating: 5,
      },
    ],
    why_choose: [
      "5+ years of experience in web development",
      "Proven track record with 100+ successful projects",
      "Modern technologies and best practices",
      "Focus on performance and user experience",
      "Transparent communication throughout the project",
      "Post-launch support and maintenance",
      "Competitive pricing with no hidden costs",
      "100% satisfaction guarantee",
    ],
    delivery_time: "2-8 weeks",
    guarantee:
      "100% satisfaction guarantee with unlimited revisions during development phase",
  },
  {
    slug: "wordpress",
    title: "WordPress Solutions",
    subtitle: "Custom themes, plugins, and headless WordPress development",
    image: "/images/services/wordpress.jpg",
    hero_description:
      "Unlock the full potential of WordPress with custom solutions tailored to your needs. From theme development to headless setups, I create powerful and flexible WordPress sites.",
    overview:
      "WordPress powers over 40% of the web, and I specialize in creating custom WordPress solutions that go beyond basic templates. Whether you need a custom theme, plugin development, or headless WordPress setup, I deliver solutions that are secure, fast, and scalable.",
    features: [
      "Custom Theme Development from Scratch",
      "Plugin Development & Customization",
      "Headless WordPress with React/Next.js",
      "WooCommerce Store Development",
      "WordPress Multisite Setup",
      "Custom Post Types & Fields",
      "WordPress REST API Integration",
      "Performance Optimization",
      "Security Hardening",
      "SEO Optimization",
      "Migration & Maintenance",
      "WordPress Training & Support",
    ],
    process: [
      {
        title: "Requirements Analysis",
        description:
          "Understanding your WordPress needs, existing content, and specific functionality requirements. I analyze your current setup and recommend the best approach.",
      },
      {
        title: "Design & Development",
        description:
          "Creating custom themes or developing plugins based on your specifications. I ensure all code follows WordPress best practices and coding standards.",
      },
      {
        title: "Testing & Optimization",
        description:
          "Thorough testing across different WordPress versions, browsers, and devices. Performance optimization to ensure fast loading times.",
      },
      {
        title: "Launch & Training",
        description:
          "Deploying your WordPress site and providing comprehensive training on how to manage content, plugins, and basic maintenance tasks.",
      },
    ],
    benefits: [
      "Easy content management with familiar WordPress interface",
      "Scalable solutions that grow with your business",
      "SEO-friendly architecture and optimization",
      "Extensive plugin ecosystem for added functionality",
      "Cost-effective solution with great ROI",
      "Regular updates and security patches",
      "Strong community support and resources",
      "Flexible design and functionality options",
    ],
    technologies: [
      "WordPress",
      "PHP",
      "MySQL",
      "JavaScript",
      "jQuery",
      "React",
      "Next.js",
      "WooCommerce",
      "ACF",
      "Elementor",
      "Gutenberg",
      "REST API",
      "GraphQL",
      "SCSS",
      "Webpack",
      "Git",
    ],
    portfolio_examples: [
      {
        id: "wp-project-1",
        title: "Custom Blog Theme",
        image: "/images/portfolio/blog-theme.jpg",
        images: ["/images/portfolio/blog-theme.jpg"],
        description:
          "A responsive blog theme with custom post types and advanced customization options.",
        longDescription:
          "A fully custom WordPress theme built from scratch for a popular travel blogger. The theme features unique layouts for different post formats, an integrated map for travel logs, and is highly optimized for performance and SEO.",
        client: "Wanderlust Chronicles",
        date: "June 2025",
        services: "Theme Development, ACF",
        budget: "$3,000",
        likes: 189,
        link: "https://example.com",
        features: [
          "Custom Post Types for Destinations",
          "Interactive Map Integration",
          "Advanced Custom Fields (ACF) Pro",
          "Lazy Loading for Images",
        ],
      },
      {
        id: "wp-project-2",
        title: "WooCommerce Store",
        image: "/images/portfolio/woocommerce-store.jpg",
        images: [
          "/images/portfolio/woocommerce-store.jpg",
          "/images/portfolio/woocommerce-store-2.jpg",
        ],
        description:
          "Complete e-commerce solution with custom checkout process and payment integration.",
        longDescription:
          "Developed a WooCommerce store for an artisanal coffee brand. The project included a custom theme, subscription-based products, and integration with a third-party shipping provider for real-time rate calculation.",
        client: "Artisan Roast Co.",
        date: "April 2025",
        services: "WooCommerce, Plugin Dev",
        budget: "$5,500",
        likes: 250,
        link: "https://example.com",
        features: [
          "WooCommerce Subscriptions",
          "Custom Checkout Fields",
          "Shipping API Integration",
          "Product Bundles",
        ],
      },
      {
        id: "wp-project-3",
        title: "Headless WordPress Site",
        image: "/images/portfolio/headless-wp.jpg",
        images: ["/images/portfolio/headless-wp.jpg"],
        description:
          "Modern headless WordPress setup with React frontend for improved performance.",
        longDescription:
          "Built a headless WordPress site for a tech news portal. The backend is powered by WordPress and its REST API, while the frontend is a lightning-fast Next.js application. This architecture provides superior performance and security.",
        client: "Tech Today",
        date: "February 2025",
        services: "Headless WP, Next.js",
        budget: "$8,000",
        likes: 312,
        link: "https://example.com",
        features: [
          "Next.js Frontend",
          "WordPress REST API",
          "Static Site Generation (SSG)",
          "Instant Search Functionality",
        ],
      },
    ],
    pricing: {
      basic: {
        price: "$800 - $2,000",
        features: [
          "Custom WordPress theme",
          "Responsive design",
          "Basic customization",
          "Plugin integration",
          "1 month support",
        ],
      },
      standard: {
        price: "$2,000 - $4,500",
        features: [
          "Advanced custom theme",
          "Custom post types & fields",
          "WooCommerce integration",
          "Performance optimization",
          "3 months support",
        ],
      },
      premium: {
        price: "$4,500 - $10,000+",
        features: [
          "Headless WordPress setup",
          "Custom plugin development",
          "Advanced integrations",
          "Multisite configuration",
          "6 months support",
          "Ongoing maintenance",
        ],
      },
    },
    faqs: [
      {
        question:
          "What's the difference between custom themes and page builders?",
        answer:
          "Custom themes are built specifically for your needs with clean code and better performance, while page builders offer more flexibility for non-technical users but can impact site speed.",
      },
      {
        question: "Can you migrate my existing website to WordPress?",
        answer:
          "Yes, I can migrate websites from various platforms to WordPress, including content, images, SEO settings, and ensuring minimal downtime during the migration process.",
      },
      {
        question: "What is headless WordPress and do I need it?",
        answer:
          "Headless WordPress separates the backend from frontend, allowing for faster, more secure sites. It's ideal for businesses wanting modern user experiences with WordPress's content management capabilities.",
      },
      {
        question: "Do you provide WordPress maintenance services?",
        answer:
          "Yes, I offer comprehensive maintenance packages including updates, backups, security monitoring, performance optimization, and content updates.",
      },
    ],
    testimonials: [
      {
        name: "Emily Rodriguez",
        company: "Creative Agency",
        feedback:
          "The custom WordPress theme exceeded our expectations. Our site is now faster and easier to manage.",
        rating: 5,
      },
      {
        name: "David Thompson",
        company: "StartupHub",
        feedback:
          "Excellent WordPress development skills. The headless setup improved our site performance significantly.",
        rating: 5,
      },
      {
        name: "Maria Garcia",
        company: "The Daily Post",
        feedback:
          "The custom plugin developed for our site works perfectly and has saved us countless hours of manual work. A fantastic developer!",
        rating: 5,
      },
      {
        name: "Ben Carter",
        company: "Artisan Goods",
        feedback:
          "Our WooCommerce store is beautiful and functional. The entire process was smooth, from initial concept to final launch.",
        rating: 5,
      },
    ],
    why_choose: [
      "WordPress certified developer with deep platform knowledge",
      "Experience with 200+ WordPress projects",
      "Custom solutions tailored to your specific needs",
      "Focus on security and performance optimization",
      "Ongoing support and maintenance available",
      "Knowledge of latest WordPress trends and technologies",
      "SEO and conversion optimization expertise",
      "Transparent pricing with detailed project scope",
    ],
    delivery_time: "3-6 weeks",
    guarantee: "30-day warranty on all custom development work",
  },
  {
    slug: "ecommerce",
    title: "E-commerce Solutions",
    subtitle: "Powerful online stores that drive sales and growth",
    image: "/images/services/ecommerce.jpg",
    hero_description:
      "Launch your online business with a robust e-commerce solution designed to maximize sales and provide excellent user experience. From WooCommerce to custom platforms.",
    overview:
      "I create comprehensive e-commerce solutions that help businesses sell online effectively. Whether you're starting fresh or upgrading an existing store, I build secure, scalable, and conversion-optimized online stores that grow with your business.",
    features: [
      "WooCommerce & Custom E-commerce Development",
      "Payment Gateway Integration (Stripe, PayPal, etc.)",
      "Inventory Management System",
      "Product Catalog & Search Functionality",
      "Shopping Cart & Checkout Optimization",
      "Order Management & Tracking",
      "Customer Account Management",
      "Email Marketing Integration",
      "Analytics & Reporting Dashboard",
      "Multi-currency & Multi-language Support",
      "Mobile-first Responsive Design",
      "SEO Optimization for Products",
    ],
    process: [
      {
        title: "Business Analysis",
        description:
          "Understanding your products, target market, and business model. I analyze your requirements and recommend the best e-commerce platform and features.",
      },
      {
        title: "Store Design & Development",
        description:
          "Creating a conversion-focused design and developing the e-commerce functionality. Focus on user experience and seamless shopping journey.",
      },
      {
        title: "Payment & Shipping Setup",
        description:
          "Integrating secure payment gateways and configuring shipping options. Testing all transaction processes to ensure reliability.",
      },
      {
        title: "Launch & Growth Support",
        description:
          "Launching your store with proper analytics setup and providing ongoing support for marketing integrations and store optimization.",
      },
    ],
    benefits: [
      "Increase sales with conversion-optimized design",
      "Reach customers 24/7 with online presence",
      "Automate order processing and inventory management",
      "Expand market reach beyond geographical limitations",
      "Build customer database for marketing campaigns",
      "Track performance with detailed analytics",
      "Scale easily as your business grows",
      "Integrate with existing business systems",
    ],
    technologies: [
      "WooCommerce",
      "Shopify",
      "Laravel",
      "PHP",
      "JavaScript",
      "React",
      "Stripe API",
      "PayPal",
      "MySQL",
      "REST API",
      "JSON",
      "CSS3",
      "Bootstrap",
      "Tailwind CSS",
      "Google Analytics",
      "Facebook Pixel",
    ],
    portfolio_examples: [
      {
        id: "ecom-project-1",
        title: "Fashion E-commerce Store",
        image: "/images/portfolio/fashion-store.jpg",
        images: [
          "/images/portfolio/fashion-store.jpg",
          "/images/portfolio/ecommerce-example.jpg",
        ],
        description:
          "Complete fashion store with size guides, wishlist functionality, and advanced filtering options.",
        longDescription:
          "A stylish and modern e-commerce store for a boutique fashion brand. The site features advanced product filtering by size, color, and style, a user-friendly wishlist, and a seamless one-page checkout process to maximize conversions.",
        client: "Chic Boutique",
        date: "August 2025",
        services: "WooCommerce, UI/UX Design",
        budget: "$6,000",
        likes: 280,
        link: "https://example.com",
        features: [
          "Advanced Product Filtering",
          "Customer Wishlist Functionality",
          "One-Page Checkout",
          "Instagram Feed Integration",
        ],
      },
      {
        id: "ecom-project-2",
        title: "Electronics Marketplace",
        image: "/images/portfolio/electronics-store.jpg",
        images: ["/images/portfolio/electronics-store.jpg"],
        description:
          "Multi-vendor marketplace with product comparison, reviews, and affiliate program integration.",
        longDescription:
          "Developed a multi-vendor marketplace for electronics, allowing different sellers to list their products. Key features include a product comparison tool, customer reviews and ratings, and an integrated affiliate program to drive sales.",
        client: "Gadget Hub",
        date: "July 2025",
        services: "Custom Platform, Marketplace",
        budget: "$15,000",
        likes: 450,
        link: "https://example.com",
        features: [
          "Multi-vendor Functionality",
          "Product Comparison Engine",
          "Customer Review System",
          "Affiliate Program Integration",
        ],
      },
      {
        id: "ecom-project-3",
        title: "Digital Products Store",
        image: "/images/portfolio/digital-store.jpg",
        images: ["/images/portfolio/digital-store.jpg"],
        description:
          "Store specializing in digital downloads with automated delivery and license management.",
        longDescription:
          "A specialized e-commerce store for selling digital products like software, e-books, and design assets. The platform features secure, automated digital delivery upon purchase and a system for managing software licenses.",
        client: "Creative Assets",
        date: "June 2025",
        services: "E-commerce, Digital Delivery",
        budget: "$4,000",
        likes: 195,
        link: "https://example.com",
        features: [
          "Automated Digital Product Delivery",
          "Secure Download Links",
          "Software License Key Generation",
          "Customer Account Area",
        ],
      },
    ],
    pricing: {
      basic: {
        price: "$1,200 - $3,000",
        features: [
          "WooCommerce store setup",
          "Up to 50 products",
          "Payment gateway integration",
          "Basic customization",
          "2 months support",
        ],
      },
      standard: {
        price: "$3,000 - $6,500",
        features: [
          "Custom e-commerce solution",
          "Unlimited products",
          "Advanced features",
          "Inventory management",
          "Marketing integrations",
          "4 months support",
        ],
      },
      premium: {
        price: "$6,500 - $15,000+",
        features: [
          "Enterprise e-commerce platform",
          "Multi-vendor marketplace",
          "Custom integrations",
          "Advanced analytics",
          "Performance optimization",
          "12 months support",
        ],
      },
    },
    faqs: [
      {
        question: "Which e-commerce platform do you recommend?",
        answer:
          "The choice depends on your specific needs. WooCommerce is great for WordPress users, Shopify for quick setup, and custom solutions for unique requirements. I'll recommend based on your business model.",
      },
      {
        question: "How secure are the payment processes?",
        answer:
          "I implement industry-standard security measures including SSL certificates, PCI compliance, and secure payment gateway integrations to ensure all transactions are protected.",
      },
      {
        question: "Can you help with product photography and content?",
        answer:
          "While I focus on development, I can recommend trusted partners for photography and content creation, and help optimize product descriptions for SEO.",
      },
      {
        question: "What ongoing support do you provide for e-commerce stores?",
        answer:
          "I offer comprehensive support including security updates, performance monitoring, backup management, and feature enhancements to keep your store running smoothly.",
      },
    ],
    testimonials: [
      {
        name: "Lisa Wang",
        company: "Fashion Forward",
        feedback:
          "Our online sales increased by 150% after launching the new e-commerce site. The user experience is fantastic!",
        rating: 5,
      },
      {
        name: "Mark Stevens",
        company: "Tech Gadgets",
        feedback:
          "Professional e-commerce development with attention to detail. The store handles high traffic without any issues.",
        rating: 5,
      },
      {
        name: "Olivia Martinez",
        company: "Home Decor Co.",
        feedback:
          "The new online store is not only beautiful but also incredibly easy for our customers to use. We've seen a significant drop in cart abandonment.",
        rating: 5,
      },
      {
        name: "James Brown",
        company: "Book Nook",
        feedback:
          "A seamless and secure e-commerce solution. The integration with our inventory system was flawless. Highly skilled and professional.",
        rating: 5,
      },
    ],
    why_choose: [
      "Specialized in conversion optimization and UX design",
      "Experience with high-traffic e-commerce sites",
      "Knowledge of latest e-commerce trends and technologies",
      "Focus on security and performance",
      "Integration expertise with marketing tools",
      "Ongoing support and optimization services",
      "Proven track record of successful online stores",
      "Transparent pricing with clear deliverables",
    ],
    delivery_time: "4-10 weeks",
    guarantee: "60-day warranty on e-commerce functionality and performance",
  },
];
