import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "portfolioData.json");

function getPortfolioData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return null;
    }
    const fileContent = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return null;
  }
}

function savePortfolioData(data) {
  try {
    const dirPath = path.join(process.cwd(), "data");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    return false;
  }
}

export async function GET() {
  const data = getPortfolioData();
  if (!data) {
    return NextResponse.json(
      { success: false, message: "Data file not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data });
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const currentData = getPortfolioData() || {};

    // Merge or update data
    const updatedData = {
      ...currentData,
      ...body,
      personalInfo: body.personalInfo || currentData.personalInfo,
      skills: body.skills || currentData.skills,
      projects: body.projects || currentData.projects,
      security: body.security || currentData.security,
    };

    const saved = savePortfolioData(updatedData);
    if (!saved) {
      return NextResponse.json(
        { success: false, message: "Failed to write data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
