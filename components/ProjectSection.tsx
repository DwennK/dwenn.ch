import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";

const projectsData = [
  {
    id: 1,
    title: "React Portfolio Website",
    description: "Mon super projet en React",
    image: "/images/projects/1.png",
    url: "https://google.com",
    tag: ["All", "Web"],
  },
  {
    id: 2,
    title: "Project 2",
    description: "Le web c'est super",
    image: "/images/projects/2.png",
    url: "https://google.com",
    tag: ["All", "Web"],
  },
  {
    id: 3,
    title: "Project 3",
    description: "Description",
    image: "/images/projects/3.png",
    url: "https://google.com",
    tag: ["All", "Web"],
  },
  {
    id: 4,
    title: "Project 4",
    description: "Description",
    image: "/images/projects/4.png",
    url: "https://google.com",
    tag: ["All", "Web"],
  },
  {
    id: 5,
    title: "Project 5",
    description: "Description",
    image: "/images/projects/5.png",
    url: "https://google.com",
    tag: ["All", "Web"],
  },
  {
    id: 6,
    title: "Project 6",
    description: "Description",
    image: "/images/projects/6.png",
    url: "https://google.com",
    tag: ["All", "Web"],
  },
];
const ProjectSection = () => {
  return (
    <section className="w-full md:w-full">
      <h2 className="text-4xl text-center font-bold mb-4">My Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {" "}
        {projectsData.map((project) => (
          <Card className="w-full mt-1 rounded-t-xl pt-0 p-0" key={project.id}>
            <CardHeader>
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={project.image}
                  width={500}
                  height={500}
                  alt={project.title}
                  className="rounded-md object-cover w-full h-full hover:opacity-30 transition-all duration-500"
                />
              </AspectRatio>
            </CardHeader>
            <CardContent>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
