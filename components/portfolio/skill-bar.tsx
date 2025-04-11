"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SkillBarProps {
  name: string
  level: number
  icon?: ReactNode
}

export default function SkillBar({ name, level, icon }: SkillBarProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="text-indigo-400">{icon}</div>}
        <div className="flex justify-between w-full">
          <span className="text-gray-300">{name}</span>
          <span className="text-indigo-400 font-medium">{level}%</span>
        </div>
      </div>

      <div className="h-2 bg-[#111133]/50 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full",
            level > 90
              ? "bg-gradient-to-r from-indigo-500 to-blue-500"
              : level > 80
                ? "bg-gradient-to-r from-indigo-500 to-indigo-400"
                : level > 70
                  ? "bg-gradient-to-r from-indigo-400 to-indigo-300"
                  : "bg-indigo-400",
          )}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
