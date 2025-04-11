"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  image: string
  link: string
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#0a0a1a]/80 backdrop-blur-md rounded-xl overflow-hidden border border-indigo-900/50 shadow-xl h-full flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg?height=400&width=600"}
          alt={project.title}
          width={600}
          height={400}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] to-transparent opacity-70"></div>
        <motion.div
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-indigo-900/30 opacity-0 transition-opacity flex items-center justify-center"
        >
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full"
          >
            <ExternalLink className="h-6 w-6" />
          </a>
        </motion.div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-gray-300 mb-4 flex-1">{project.description}</p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
