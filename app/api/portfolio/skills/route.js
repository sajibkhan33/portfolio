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

// POST: Add new skill category or item
export async function POST(request) {
  try {
    const { category, items } = await request.json();
    const currentData = getPortfolioData();
    if (!currentData) {
      return NextResponse.json({ success: false, message: "Database not found" }, { status: 404 });
    }

    const itemsArray = Array.isArray(items)
      ? items
      : typeof items === "string"
      ? items.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const newSkillGroup = {
      id: `skill-${Date.now()}`,
      category,
      items: itemsArray,
    };

    currentData.skills = [...(currentData.skills || []), newSkillGroup];
    savePortfolioData(currentData);

    return NextResponse.json({ success: true, skills: currentData.skills });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Update all skills or specific skill category
export async function PUT(request) {
  try {
    const updatedSkills = await request.json();
    const currentData = getPortfolioData();
    if (!currentData) {
      return NextResponse.json({ success: false, message: "Database not found" }, { status: 404 });
    }

    currentData.skills = updatedSkills;
    savePortfolioData(currentData);

    return NextResponse.json({ success: true, skills: currentData.skills });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Delete a skill group by ID
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Skill group ID is required" }, { status: 400 });
    }

    const currentData = getPortfolioData();
    if (!currentData) {
      return NextResponse.json({ success: false, message: "Database not found" }, { status: 404 });
    }

    currentData.skills = (currentData.skills || []).filter((s) => s.id !== id);
    savePortfolioData(currentData);

    return NextResponse.json({ success: true, skills: currentData.skills });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
