import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  let browser;
  try {
    const { html } = await request.json();
    if (!html || typeof html !== "string") {
      return NextResponse.json({ error: "Campo 'html' obrigatório" }, { status: 400 });
    }

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="curriculo.pdf"',
      },
    });
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao gerar PDF" },
      { status: 500 }
    );
  } finally {
    await browser?.close();
  }
}
