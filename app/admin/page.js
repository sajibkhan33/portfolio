"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("projects");
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    bgImage: "/portfolio.png",
    tags: "",
    link: "",
    githubLink: "",
  });

  // Skills Form State
  const [newSkillCategory, setNewSkillCategory] = useState("");
  const [newSkillItems, setNewSkillItems] = useState("");

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    title: "",
    location: "",
    email: "",
    github: "",
    linkedin: "",
    facebook: "",
    bio: "",
  });

  // Settings State
  const [newPin, setNewPin] = useState("");

  // Fetch initial portfolio data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/portfolio");
      const json = await res.json();
      if (json.success) {
        setPortfolioData(json.data);
        if (json.data.personalInfo) {
          setProfileForm(json.data.personalInfo);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authStatus = sessionStorage.getItem("adminAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    fetchData();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const correctPin = portfolioData?.security?.adminPin || "1234";
    if (pinInput.trim() === correctPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      setLoginError("");
      showToast("Welcome to Admin Dashboard!");
    } else {
      setLoginError("Invalid PIN! Default is 1234.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
  };

  // --- PROJECTS CRUD ---
  const openAddProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: "",
      description: "",
      bgImage: "/portfolio.png",
      tags: "React, Node.js, Tailwind CSS",
      link: "https://",
      githubLink: "https://github.com/sajibkhan33",
    });
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title || "",
      description: proj.description || "",
      bgImage: proj.bgImage || "/portfolio.png",
      tags: Array.isArray(proj.tags) ? proj.tags.join(", ") : proj.tags || "",
      link: proj.link || "",
      githubLink: proj.githubLink || "",
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...projectForm,
        tags: projectForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      if (editingProject) {
        payload.id = editingProject.id;
        const res = await fetch("/api/portfolio/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setPortfolioData((prev) => ({ ...prev, projects: data.projects }));
          showToast("Project updated successfully!");
        }
      } else {
        const res = await fetch("/api/portfolio/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setPortfolioData((prev) => ({ ...prev, projects: data.projects }));
          showToast("New project added successfully!");
        }
      }
      setIsProjectModalOpen(false);
    } catch (err) {
      showToast("Error saving project.");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/portfolio/projects?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPortfolioData((prev) => ({ ...prev, projects: data.projects }));
        showToast("Project deleted successfully.");
      }
    } catch (err) {
      showToast("Error deleting project.");
    }
  };

  // --- SKILLS CRUD ---
  const handleAddSkillGroup = async (e) => {
    e.preventDefault();
    if (!newSkillCategory) return;
    try {
      const res = await fetch("/api/portfolio/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: newSkillCategory,
          items: newSkillItems,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPortfolioData((prev) => ({ ...prev, skills: data.skills }));
        setNewSkillCategory("");
        setNewSkillItems("");
        showToast("New skill category added!");
      }
    } catch (err) {
      showToast("Error adding skill category.");
    }
  };

  const handleDeleteSkillGroup = async (id) => {
    if (!confirm("Delete this skill category?")) return;
    try {
      const res = await fetch(`/api/portfolio/skills?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPortfolioData((prev) => ({ ...prev, skills: data.skills }));
        showToast("Skill category deleted.");
      }
    } catch (err) {
      showToast("Error deleting skill category.");
    }
  };

  // --- PROFILE & BIO CRUD ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personalInfo: profileForm }),
      });
      const data = await res.json();
      if (data.success) {
        setPortfolioData(data.data);
        showToast("Profile & Bio updated successfully!");
      }
    } catch (err) {
      showToast("Error updating profile.");
    }
  };

  // --- SETTINGS (PIN CHANGE) ---
  const handleSavePin = async (e) => {
    e.preventDefault();
    if (!newPin.trim()) return;
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ security: { adminPin: newPin.trim() } }),
      });
      const data = await res.json();
      if (data.success) {
        setPortfolioData(data.data);
        setNewPin("");
        showToast("Admin PIN updated successfully!");
      }
    } catch (err) {
      showToast("Error updating PIN.");
    }
  };

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-purple-600/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border border-purple-500/30">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mb-6">
            Enter Admin Passcode / PIN to manage portfolio data
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN (Default: 1234)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-center text-xl tracking-widest text-white outline-none focus:border-purple-500 transition"
              required
            />
            {loginError && (
              <p className="text-red-400 text-xs">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition shadow-lg shadow-purple-600/30"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700/60">
            <Link
              href="/"
              className="text-xs text-purple-400 hover:text-purple-300 transition"
            >
              ← Return to Portfolio Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-purple-600 text-white px-5 py-3 rounded-xl shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white shadow-md">
            SK
          </span>
          <div>
            <h1 className="font-bold text-base leading-tight">Admin CMS</h1>
            <p className="text-xs text-slate-400">Sajib Khan Portfolio Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium transition flex items-center gap-1.5"
          >
            👁️ View Live Website
          </Link>
          <Link
            href="/resume"
            target="_blank"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium transition flex items-center gap-1.5"
          >
            📄 View CV
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-900/40 border-b border-slate-800 px-6">
        <div className="flex items-center gap-6 overflow-x-auto text-sm font-medium">
          <button
            onClick={() => setActiveTab("projects")}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
              activeTab === "projects"
                ? "border-purple-500 text-purple-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            💼 Projects ({portfolioData?.projects?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
              activeTab === "skills"
                ? "border-purple-500 text-purple-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            🛠️ Skills & Tools ({portfolioData?.skills?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
              activeTab === "profile"
                ? "border-purple-500 text-purple-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            👤 Profile & Bio
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
              activeTab === "settings"
                ? "border-purple-500 text-purple-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {/* --- TAB 1: PROJECTS --- */}
        {activeTab === "projects" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">Manage Projects</h2>
                <p className="text-xs text-slate-400">
                  Add, update, or remove portfolio projects in real time
                </p>
              </div>
              <button
                onClick={openAddProjectModal}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 font-medium text-sm transition flex items-center gap-2 shadow-lg shadow-purple-600/30"
              >
                + Add New Project
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioData?.projects?.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg text-white">{proj.title}</h3>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {proj.description}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 my-3">
                      {proj.tags?.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-purple-950/70 text-purple-300 border border-purple-800/40 px-2 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      🔗 <a href={proj.link} target="_blank" className="hover:underline text-purple-400">{proj.link}</a>
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-3 px-5 border-t border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditProjectModal(proj)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: SKILLS --- */}
        {activeTab === "skills" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold">Skills & Tools Management</h2>
              <p className="text-xs text-slate-400">
                Manage your technical skills and categorized stacks
              </p>
            </div>

            {/* Add Skill Group Form */}
            <form
              onSubmit={handleAddSkillGroup}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 max-w-2xl"
            >
              <h3 className="text-sm font-bold text-white mb-3">+ Add New Skill Category</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Cloud & DevOps)"
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Items (comma separated: Docker, AWS, CI/CD)"
                  value={newSkillItems}
                  onChange={(e) => setNewSkillItems(e.target.value)}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold transition"
              >
                Save Category
              </button>
            </form>

            {/* Skill Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioData?.skills?.map((skillGroup) => (
                <div
                  key={skillGroup.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-base text-purple-300">
                        {skillGroup.category}
                      </h3>
                      <button
                        onClick={() => handleDeleteSkillGroup(skillGroup.id)}
                        className="text-xs text-red-400 hover:text-red-300 p-1"
                      >
                        Delete Category ✕
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items?.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1 rounded-lg"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 3: PROFILE & BIO --- */}
        {activeTab === "profile" && (
          <div className="max-w-3xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Personal Profile & Bio</h2>
              <p className="text-xs text-slate-400">
                Update name, headline title, contact email, and bio description
              </p>
            </div>

            <form
              onSubmit={handleSaveProfile}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Headline Title / Role
                  </label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, location: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Bio / Summary
                </label>
                <textarea
                  rows="4"
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={profileForm.github}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, github: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={profileForm.linkedin}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, linkedin: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    value={profileForm.facebook}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, facebook: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold text-sm transition shadow-lg shadow-purple-600/30"
              >
                💾 Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* --- TAB 4: SETTINGS --- */}
        {activeTab === "settings" && (
          <div className="max-w-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Admin Security & Settings</h2>
              <p className="text-xs text-slate-400">
                Change your Admin login PIN
              </p>
            </div>

            <form
              onSubmit={handleSavePin}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  New Admin PIN
                </label>
                <input
                  type="password"
                  placeholder="Enter new PIN"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold text-sm transition"
              >
                Update PIN
              </button>
            </form>
          </div>
        )}
      </main>

      {/* --- ADD / EDIT PROJECT MODAL --- */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg">
                {editingProject ? "✏️ Edit Project" : "✨ Add New Project"}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI Chat Application"
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Description / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Web App"
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Tech Stack Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, MongoDB, Tailwind"
                  value={projectForm.tags}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, tags: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={projectForm.link}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, link: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={projectForm.githubLink}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        githubLink: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Background Image Path or URL
                </label>
                <input
                  type="text"
                  placeholder="/dragon-news.png, /portfolio.png or https://..."
                  value={projectForm.bgImage}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, bgImage: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold"
                >
                  {editingProject ? "Update Project" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
