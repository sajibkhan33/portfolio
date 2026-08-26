import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "portfolioData.json");

function getPortfolioData() {
  try {
    if (!fs.existsSync(dataFilePath)) return null;
    return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
  } catch (error) {
    return null;
  }
}

function savePortfolioData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    return false;
  }
}

// POST: Add new project
export async function POST(request) {
  try {
    const newProject = await request.json();
    const currentData = getPortfolioData();
    if (!currentData) {
      return NextResponse.json({ success: false, message: "Database not found" }, { status: 404 });
    }

    const projectWithId = {
      ...newProject,
      id: newProject.id || `proj-${Date.now()}`,
      tags: Array.isArray(newProject.tags)
        ? newProject.tags
        : typeof newProject.tags === "string"
        ? newProject.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    currentData.projects = [projectWithId, ...(currentData.projects || [])];
    savePortfolioData(currentData);

    return NextResponse.json({ success: true, project: projectWithId, projects: currentData.projects });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Update project
export async function PUT(request) {
  try {
    const updatedProject = await request.json();
    const currentData = getPortfolioData();
    if (!currentData) {
      return NextResponse.json({ success: false, message: "Database not found" }, { status: 404 });
    }

    const formattedProject = {
      ...updatedProject,
      tags: Array.isArray(updatedProject.tags)
        ? updatedProject.tags
        : typeof updatedProject.tags === "string"
        ? updatedProject.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    currentData.projects = (currentData.projects || []).map((proj) =>
      proj.id === formattedProject.id ? formattedProject : proj
    );

    savePortfolioData(currentData);
    return NextResponse.json({ success: true, projects: currentData.projects });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Delete project
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Project ID is required" }, { status: 400 });
    }

    const currentData = getPortfolioData();
    if (!currentData) {
      return NextResponse.json({ success: false, message: "Database not found" }, { status: 404 });
    }

    currentData.projects = (currentData.projects || []).filter((proj) => proj.id !== id);
    savePortfolioData(currentData);

    return NextResponse.json({ success: true, projects: currentData.projects });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
