import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Student Council Website",
    description: "The Website of the student council of SMA Negeri Unggulan M.H. Thamrin Dharmandala Sandhyakala's Cabinet",
    image: "gradient-from-blue-500-to-purple-600",
    tags: ["PHP", "Laravel", "HTML CSS JS", "Blade.PHP", "SQL"],
    url: "https://ospkmhthamrin.com",
  },
  {
    title: "Ignotum",
    description: "A homemade anonymous social media, like secreto.",
    image: "gradient-from-purple-500-to-pink-600",
    tags: ["Express.js", "EJS", "MongoDB", "HTML CSS JS", "Bootstrap"],
    url: "https://github.com/yeahbois/ignotum",
  },
  {
    title: "OpenCV Flask AI",
    description: "Basic OpenCV project but with flask and realtime AI analyzing for things using websocket.",
    image: "gradient-from-cyan-500-to-blue-600",
    tags: ["Python", "WebSocket", "YOLOV8", "Flask", "Pillow", "HTML CSS JS"],
    url: "https://github.com/opencv-flaskai",
  },
  {
    title: "Portofolio Site",
    description: "My own portfolio site made with React via Typescript and Vite.",
    image: "gradient-from-green-500-to-teal-600",
    tags: ["React", "Vite", "TypeScript", "Three.js", "HTML CSS JS", "TailwindCSS"],
    url: "https://yeahbois.github.io",
  },
  {
    title: "FaldaBot",
    description: "A multipurpose Discord bot that have many features. My very first coding project.",
    image: "gradient-from-orange-500-to-red-600",
    tags: ["Python", "Discord.py", "Pycord", "APIS"],
    url: "https://github.com/yeahbois/FaldaBot",
  },
  {
    title: "Quant Coming Soon",
    description: "My coming soon quantitative programming project using AI.",
    image: "gradient-from-indigo-500-to-purple-600",
    tags: ["Python", "Flask", "FastAPI", "TradingView", "Numpy & Pandas", "Matplotlib & Seaborn"],
    url: "https://github.com/yeahbois",
  },
];

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 md:py-32 bg-muted/30">
      <div className="container px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my work in AI and web development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group glass h-full hover:shadow-glow transition-all duration-500 overflow-hidden border-border/50">
                {/* Project Image/Gradient */}
                <div className={`h-48 bg-${project.image} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80 group-hover:scale-110 transition-transform duration-500" />
                </div>

                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant="ghost"
                    className="w-full group/btn"
                    asChild
                  >
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      View Details
                      <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};