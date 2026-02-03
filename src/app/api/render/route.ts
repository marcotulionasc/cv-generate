import { NextRequest, NextResponse } from "next/server";
import { renderCv } from "@/lib/render-cv";
import type { CVData } from "@/lib/cv-types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = body as CVData;

    if (!data?.nome || !data?.email) {
      return NextResponse.json(
        { error: "Campos obrigatórios: nome, email" },
        { status: 400 }
      );
    }

    const html = renderCv(data);
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Erro ao renderizar CV:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao renderizar CV" },
      { status: 500 }
    );
  }
}
