import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "AI Sentiment Analysis Tool",
    description: "Real-time sentiment analysis platform using NLP and machine learning to analyze customer feedback across multiple channels.",
    image: "gradient-from-blue-500-to-purple-600",
    tags: ["Python", "TensorFlow", "NLP", "React"],
  },
  {
    title: "Data Visualization Dashboard",
    description: "Interactive dashboard for business intelligence with real-time data processing and beautiful visualizations.",
    image: "gradient-from-purple-500-to-pink-600",
    tags: ["React", "D3.js", "Python", "PostgreSQL"],
  },
  {
    title: "Predictive Analytics Engine",
    description: "Machine learning model for forecasting sales trends and market analysis with 95% accuracy.",
    image: "gradient-from-cyan-500-to-blue-600",
    tags: ["Python", "Scikit-learn", "Pandas", "AWS"],
  },
  {
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution with AI-powered product recommendations and seamless checkout experience.",
    image: "gradient-from-green-500-to-teal-600",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
  },
  {
    title: "Computer Vision System",
    description: "Object detection and classification system for automated quality control in manufacturing.",
    image: "gradient-from-orange-500-to-red-600",
    tags: ["Python", "OpenCV", "PyTorch", "Docker"],
  },
  {
    title: "Financial Analytics Platform",
    description: "Comprehensive financial analysis tool with portfolio optimization and risk assessment features.",
    image: "gradient-from-indigo-500-to-purple-600",
    tags: ["React", "Python", "FastAPI", "TradingView"],
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
            A showcase of my work in AI, data analysis, and web development
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
                    <a href="#" onClick={(e) => e.preventDefault()}>
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
