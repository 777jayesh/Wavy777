"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Brain,
  Code,
  Database,
  Cpu,
  BarChart,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  ArrowLeft,
  Layers,
  Network,
  Bot,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// Dynamically import components for better performance
const PortfolioBackground = dynamic(() => import("@/components/portfolio/portfolio-background"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#050714]" />,
})

const NeuralNetworkAnimation = dynamic(() => import("@/components/portfolio/neural-network"), {
  ssr: false,
})

const ProjectCard = dynamic(() => import("@/components/portfolio/project-card"), {
  ssr: false,
})

const SkillBar = dynamic(() => import("@/components/portfolio/skill-bar"), {
  ssr: false,
})

// Define projects
const projects = [
  {
    id: "project1",
    title: "Neural Network Visualization",
    description:
      "Interactive visualization of neural networks for educational purposes, built with TensorFlow.js and React.",
    tags: ["Machine Learning", "React", "TensorFlow.js", "D3.js"],
    image: "/portfolio/neural-viz.jpg",
    link: "#",
  },
  {
    id: "project2",
    title: "Sentiment Analysis API",
    description:
      "Real-time sentiment analysis API using BERT and FastAPI, deployed on AWS with auto-scaling capabilities.",
    tags: ["NLP", "BERT", "FastAPI", "AWS"],
    image: "/portfolio/sentiment.jpg",
    link: "#",
  },
  {
    id: "project3",
    title: "Computer Vision Object Detector",
    description:
      "Mobile-optimized object detection system using YOLOv5, with React Native frontend and Python backend.",
    tags: ["Computer Vision", "PyTorch", "React Native", "YOLOv5"],
    image: "/portfolio/object-detection.jpg",
    link: "#",
  },
  {
    id: "project4",
    title: "Recommendation Engine",
    description: "Content-based and collaborative filtering recommendation system for e-commerce platforms.",
    tags: ["Recommendation Systems", "Python", "Scikit-learn", "PostgreSQL"],
    image: "/portfolio/recommendation.jpg",
    link: "#",
  },
]

// Define skills
const skills = [
  { name: "Machine Learning", level: 90, icon: <Brain className="h-5 w-5" /> },
  { name: "Deep Learning", level: 85, icon: <Network className="h-5 w-5" /> },
  { name: "Natural Language Processing", level: 80, icon: <Bot className="h-5 w-5" /> },
  { name: "Computer Vision", level: 75, icon: <Cpu className="h-5 w-5" /> },
  { name: "Python", level: 95, icon: <Code className="h-5 w-5" /> },
  { name: "TensorFlow/PyTorch", level: 80, icon: <Layers className="h-5 w-5" /> },
  { name: "Data Analysis", level: 85, icon: <BarChart className="h-5 w-5" /> },
  { name: "SQL/NoSQL", level: 75, icon: <Database className="h-5 w-5" /> },
]

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState("hero")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const sections = ["hero", "about", "skills", "projects", "contact"]
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const { scrollY } = useScroll()

  // Parallax effects
  const heroTextY = useTransform(scrollY, [0, 500], [0, 100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  // Initialize section refs
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (const section of sections) {
        const element = sectionRefs.current[section]
        if (!element) continue

        const { offsetTop, offsetHeight } = element

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (section: string) => {
    setIsMobileMenuOpen(false)
    const element = sectionRefs.current[section]
    if (!element) return

    window.scrollTo({
      top: element.offsetTop,
      behavior: "smooth",
    })
  }

  return (
    <main className="min-h-screen bg-[#050714] text-white relative overflow-hidden">
      {/* Background */}
      <PortfolioBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050714]/80 backdrop-blur-md border-b border-indigo-900/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5 text-indigo-400" />
            <span className="text-indigo-400">Back to Birthday</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={cn(
                  "text-sm font-medium transition-colors relative",
                  activeSection === section ? "text-indigo-400" : "text-gray-400 hover:text-white",
                )}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
                {activeSection === section && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-400"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-indigo-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ChevronDown className={`h-5 w-5 transition-transform ${isMobileMenuOpen ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#0a0a1a]/95 backdrop-blur-md border-b border-indigo-900/50"
          >
            <div className="container mx-auto px-4 py-2">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={cn(
                    "block w-full text-left py-3 text-sm font-medium transition-colors",
                    activeSection === section ? "text-indigo-400" : "text-gray-400 hover:text-white",
                  )}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        ref={(el) => (sectionRefs.current.hero = el)}
        className="min-h-screen flex items-center justify-center relative pt-20"
      >
        <motion.div
          className="container mx-auto px-4 py-20 text-center relative z-10"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="bg-indigo-900/30 backdrop-blur-sm p-3 rounded-full border border-indigo-700/50 inline-flex items-center justify-center">
              <Brain className="h-8 w-8 text-indigo-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-500 to-indigo-600"
          >
            Jayesh Kucha
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4"
          >
            AI/ML Engineering Student
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center justify-center gap-2 mb-10"
          >
            <GraduationCap className="h-5 w-5 text-indigo-400" />
            <span className="text-indigo-300">3rd Year Undergraduate</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => scrollToSection("projects")}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-none"
              size="lg"
            >
              View Projects
            </Button>

            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              className="border-indigo-600 text-indigo-400 hover:bg-indigo-950/50"
              size="lg"
            >
              Contact Me
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              onClick={() => scrollToSection("about")}
              className="cursor-pointer"
            >
              <ChevronDown className="h-8 w-8 text-indigo-400" />
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 z-0 overflow-hidden">
          <NeuralNetworkAnimation />
        </div>
      </section>

      {/* About Section */}
      <section ref={(el) => (sectionRefs.current.about = el)} className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-indigo-800/50"></div>
              <h2 className="text-3xl font-bold text-indigo-400">About Me</h2>
              <div className="h-px flex-1 bg-indigo-800/50"></div>
            </div>

            <div className="bg-[#0a0a1a]/80 backdrop-blur-md rounded-xl p-8 border border-indigo-900/50 shadow-xl">
              <p className="text-lg text-gray-300 mb-6">
                I'm Jayesh Kucha, a 3rd-year AI/ML Engineering student passionate about developing intelligent systems
                that solve real-world problems. My journey in artificial intelligence began with a fascination for how
                machines can learn and adapt, leading me to specialize in neural networks, natural language processing,
                and computer vision.
              </p>

              <p className="text-lg text-gray-300 mb-6">
                With a strong foundation in mathematics and computer science, I approach AI challenges by combining
                theoretical knowledge with practical implementation. I'm currently focusing on deep learning
                applications and exploring how AI can be used to create more accessible and ethical technology
                solutions.
              </p>

              <p className="text-lg text-gray-300">
                When I'm not coding or studying, I enjoy contributing to open-source projects and participating in AI
                hackathons. I believe in the power of AI to transform industries and improve lives, and I'm excited to
                be part of this rapidly evolving field as I continue my education.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={(el) => (sectionRefs.current.skills = el)} className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-indigo-800/50"></div>
              <h2 className="text-3xl font-bold text-indigo-400">Skills</h2>
              <div className="h-px flex-1 bg-indigo-800/50"></div>
            </div>

            <div className="bg-[#0a0a1a]/80 backdrop-blur-md rounded-xl p-8 border border-indigo-900/50 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <SkillBar name={skill.name} level={skill.level} icon={skill.icon} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={(el) => (sectionRefs.current.projects = el)} className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px flex-1 bg-indigo-800/50"></div>
              <h2 className="text-3xl font-bold text-indigo-400">Projects</h2>
              <div className="h-px flex-1 bg-indigo-800/50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={(el) => (sectionRefs.current.contact = el)} className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-indigo-800/50"></div>
              <h2 className="text-3xl font-bold text-indigo-400">Contact</h2>
              <div className="h-px flex-1 bg-indigo-800/50"></div>
            </div>

            <div className="bg-[#0a0a1a]/80 backdrop-blur-md rounded-xl p-8 border border-indigo-900/50 shadow-xl">
              <p className="text-lg text-gray-300 mb-8 text-center">
                Interested in working together or have a question? Feel free to reach out!
              </p>

              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <motion.a
                  href="mailto:0jayesh777@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-[#111133]/50 hover:bg-[#111133]/80 p-4 rounded-lg border border-indigo-800/50 transition-colors"
                >
                  <Mail className="h-6 w-6 text-indigo-400" />
                  <span>Email Me</span>
                </motion.a>

                <motion.a
                  href="https://github.com/777jayesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-[#111133]/50 hover:bg-[#111133]/80 p-4 rounded-lg border border-indigo-800/50 transition-colors"
                >
                  <Github className="h-6 w-6 text-indigo-400" />
                  <span>GitHub</span>
                </motion.a>

                <motion.a
                  href="https://www.linkedin.com/in/jayesh-k-76278a231/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-[#111133]/50 hover:bg-[#111133]/80 p-4 rounded-lg border border-indigo-800/50 transition-colors"
                >
                  <Linkedin className="h-6 w-6 text-indigo-400" />
                  <span>LinkedIn</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-indigo-900/50 bg-[#050714]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Jayesh Kucha | AI/ML Engineering Student. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
