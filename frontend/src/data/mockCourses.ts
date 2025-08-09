import heroImg from "@/assets/hero-education.jpg";
import type { Course } from "@/components/CourseCard";

export const mockCourses: Course[] = [
  {
    id: "react-101",
    title: "React 101: Build Modern Interfaces",
    description: "Learn the fundamentals of React, hooks, and component patterns.",
    instructor: "Jane Doe",
    price: 49,
    rating: 4.7,
    image: heroImg,
    lessons: [
      { title: "Intro to React", duration: "08:42" },
      { title: "JSX & Rendering", duration: "12:30" },
      { title: "State & Props", duration: "16:18" },
    ],
  },
  {
    id: "ts-mastery",
    title: "TypeScript Mastery",
    description: "Type your JavaScript like a pro and prevent bugs.",
    instructor: "John Smith",
    price: 59,
    rating: 4.8,
    image: heroImg,
    lessons: [
      { title: "Types & Interfaces", duration: "10:05" },
      { title: "Generics", duration: "14:50" },
      { title: "Advanced Types", duration: "18:22" },
    ],
  },
  {
    id: "tailwind-design",
    title: "Tailwind for Beautiful Design Systems",
    description: "Craft consistent UI with semantic tokens and components.",
    instructor: "Alex Rivera",
    price: 39,
    rating: 4.6,
    image: heroImg,
    lessons: [
      { title: "Design Tokens", duration: "09:17" },
      { title: "Components & Variants", duration: "11:08" },
      { title: "Theming", duration: "13:44" },
    ],
  },
  {
    id: "node-api",
    title: "Node API Fundamentals",
    description: "Build robust REST APIs with best practices.",
    instructor: "Taylor Lee",
    price: 69,
    rating: 4.9,
    image: heroImg,
    lessons: [
      { title: "Routing & Controllers", duration: "10:59" },
      { title: "Validation", duration: "12:21" },
      { title: "Testing", duration: "15:36" },
    ],
  },
];
