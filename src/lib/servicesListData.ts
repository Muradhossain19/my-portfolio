import { FaCode, FaWordpress, FaShoppingCart } from "react-icons/fa";
import { IconType } from "react-icons";

export interface ServiceListItem {
  slug: string;
  title: string;
  description: string;
  icon: IconType;
}

export const servicesList: ServiceListItem[] = [
  {
    slug: "web-development",
    title: "Custom Web Development",
    description:
      "Building unique, high-performance websites from scratch with modern technologies like React and Next.js.",
    icon: FaCode,
  },
  {
    slug: "wordpress",
    title: "WordPress Solutions",
    description:
      "Custom themes, plugins, and headless WordPress development for powerful and flexible websites.",
    icon: FaWordpress,
  },
  {
    slug: "ecommerce",
    title: "E-commerce Solutions",
    description:
      "Powerful online stores that drive sales and growth, using platforms like WooCommerce or custom solutions.",
    icon: FaShoppingCart,
  },
];
