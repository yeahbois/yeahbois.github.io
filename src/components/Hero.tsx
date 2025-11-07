// Hero.tsx
import { motion } from "framer-motion";
import { ChevronDown, Github, Linkedin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero3D } from "./Hero3D";
import { Laptop3D } from "./Laptop3D"; // Import the new component

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

      {/* Content Container */}
      <div className="container px-4 z-10 h-full flex flex-col justify-center">
        {/* Desktop Layout: Side by Side */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center h-full">
          {/* Left Side: Original Content - Now Centered */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-8"
          >
            {/* Main Heading */}
            <h1 className="font-bold tracking-tight">
              <span className="text-5xl md:text-7xl lg:text-8xl block text-foreground">yb#2702</span>
              <span className="text-2xl md:text-5xl lg:text-4xl block gradient-text mt-2">
                Web Developer & AI Engineer
              </span>
            </h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
            >
              Transforming dreams into reality and building intelligent solutions
              for the future. #BuildingABetterFuture
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

          {/* Right Side: 3D MacBook - Now 30-40% Larger */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex justify-center items-center h-full relative"
          >
            <Laptop3D />
          </motion.div>
        </div>

        {/* Mobile Layout: Stacked */}
        <div className="lg:hidden flex flex-col items-center justify-center h-full space-y-8 pt-24">
          {/* MacBook on Top for Mobile */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-96"
          >
            <Laptop3D />
          </motion.div>
          {/* Original Content on Bottom for Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-center space-y-8 w-full"
          >
            {/* Main Heading */}
            <h1 className="font-bold tracking-tight">
              <span className="text-5xl md:text-7xl block text-foreground">yb#2702</span>
              <span className="text-2xl md:text-5xl block gradient-text mt-2">
                Web Developer & AI Engineer
              </span>
            </h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
            >
              Transforming dreams into reality and building intelligent solutions
              for the future. #BuildingABetterFuture
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
        </div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          onClick={() => scrollToSection("about")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float cursor-pointer group lg:mb-0 mb-24"
          aria-label="Scroll to About section"
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.button>
      </div>
    </section>
  );
};