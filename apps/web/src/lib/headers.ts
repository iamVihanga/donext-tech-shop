"use server";
import { headers } from "next/headers";

export async function getHeaders() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  return cookieHeader && { cookie: cookieHeader };
}
