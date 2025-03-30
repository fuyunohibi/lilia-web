// app/api/plant-search/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isRandom = searchParams.get("random");
  const query = searchParams.get("q");
  const page = searchParams.get("page") || "1";

  const API_KEY = process.env.PERENUAL_CREDENTIAL_KEY;

  let url = "";

  if (isRandom === "true") {
    const randomPage = Math.floor(Math.random() * 100) + 1;
    url = `https://perenual.com/api/species-list?page=${randomPage}&key=${API_KEY}`;
  } else if (query) {
    url = `https://perenual.com/api/species-list?key=${API_KEY}&q=${query}&page=${page}`;
  } else {
    return NextResponse.json(
      { error: "Missing query or random parameter" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from Perenual API" },
      { status: 500 }
    );
  }
}
