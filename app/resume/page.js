"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { resumeData } from "@/assets/resumeData";

export default function ResumePage() {
  const [data, setData] = useState(resumeData);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await fetch("/api/portfolio");
        const json = await res.json();
        if (json.success && json.data) {
          setData((prev) => ({
            ...prev,
            personalInfo: json.data.personalInfo || prev.personalInfo,
            skills: json.data.skills || prev.skills,
            projects: json.data.projects
              ? json.data.projects.map((p) => ({
                  title: p.title,
                  category: p.description,
                  techStack: Array.isArray(p.tags) ? p.tags : [],
                  link: p.link,
                  highlights: [p.description],
                }))
              : prev.projects,
          }));
        }
      } catch (e) {
        console.error("Using local resume data:", e);
      }
    };
    fetchLiveData();
  }, []);

  const { personalInfo, skills, education, projects } = data;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 sm:px-6 print:bg-white print:py-0 print:px-0">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-white text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800 transition shadow-sm flex items-center gap-2"
        >
          ← Back to Portfolio
        </Link>
        <button
          onClick={handlePrint}
          className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition shadow-md flex items-center gap-2"
        >
          🖨️ Print / Download PDF
        </button>
      </div>

      {/* CV Paper Document */}
      <div className="max-w-4xl mx-auto bg-white text-gray-900 shadow-xl border border-gray-200 rounded-xl p-8 sm:p-12 print:shadow-none print:border-none print:rounded-none print:p-0 print:max-w-full">
        {/* Header / Contact Info */}
        <header className="border-b border-gray-300 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                {personalInfo.name}
              </h1>
              <p className="text-lg font-semibold text-purple-700 mt-1">
                {personalInfo.title}
              </p>
            </div>
            <div className="text-sm text-gray-600 space-y-1 sm:text-right">
              <p>📍 {personalInfo.location}</p>
              <p>
                ✉️{" "}
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover:underline text-purple-700"
                >
                  {personalInfo.email}
                </a>
              </p>
              <p>
                🌐{" "}
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-purple-700"
                >
                  GitHub
                </a>{" "}
                |{" "}
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-purple-700"
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {personalInfo.summary}
          </p>
        </section>

        {/* Skills */}
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-3">
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {skills.map((skillGroup, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 print:bg-transparent print:p-0 print:border-none">
                <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wide mb-1.5">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skillGroup.items.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      className="text-xs bg-purple-50 text-purple-900 px-2 py-0.5 rounded border border-purple-200 print:border-gray-300 print:bg-gray-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-3">
            Key Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project, idx) => (
              <div key={idx} className="border-l-2 border-purple-500 pl-4 py-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-gray-900 text-base">
                    {project.title}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      ({project.category})
                    </span>
                  </h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-700 font-medium hover:underline print:text-gray-800"
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 my-1.5">
                  {project.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] bg-gray-100 text-gray-800 font-medium px-1.5 py-0.2 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                  {project.highlights.map((point, pIdx) => (
                    <li key={pIdx}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-4">
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-3">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline text-sm">
              <div>
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-xs text-gray-600">{edu.institution} — {edu.location}</p>
              </div>
              <span className="text-xs text-gray-500 font-medium">{edu.year}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
