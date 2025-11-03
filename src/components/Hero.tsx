import { motion } from "framer-motion";
import { ChevronDown, Github, Linkedin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero3D } from "./Hero3D";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <Hero3D />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background -z-10" />

      {/* Content */}
      <div className="container px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8"
        >
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="block text-foreground">Your Name</span>
            <span className="block gradient-text mt-2">
              AI Developer & Data Analyst
            </span>
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          >
            Transforming data into insights and building intelligent solutions
            for the future
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap gap-4 justify-center items-center"
          >
            <Button
              variant="gradient"
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="group"
            >
              Get in Touch
              <Mail className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            </Button>

            <div className="flex gap-3">
              <Button
                variant="hero"
                size="icon"
                asChild
                className="rounded-full"
                aria-label="LinkedIn Profile"
              >
                <a
                  href="https://linkedin.com/in/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>

              <Button
                variant="hero"
                size="icon"
                asChild
                className="rounded-full"
                aria-label="GitHub Profile"
              >
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>

              <Button
                variant="hero"
                size="icon"
                asChild
                className="rounded-full"
                aria-label="Email Contact"
              >
                <a href="mailto:your.email@example.com">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>

              <Button
                variant="hero"
                size="icon"
                asChild
                className="rounded-full"
                aria-label="Phone Contact"
              >
                <a href="tel:+1234567890">
                  <Phone className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          onClick={() => scrollToSection("about")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float cursor-pointer group"
          aria-label="Scroll to About section"
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.button>
      </div>
    </section>
  );
};
