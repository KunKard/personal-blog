import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getAdminProjects, createProject } from "@/lib/db/projects";
import type { ProjectInsert } from "@/lib/types";

export async function GET() {
  const projects = await getAdminProjects();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: ProjectInsert = await req.json();
  const project = await createProject(body);
  return NextResponse.json(project, { status: 201 });
}
