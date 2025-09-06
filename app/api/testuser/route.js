
// /app/api/testuser/route.js
import { fetchuser } from "@/actions/userserveraction";

export async function GET() {
  try {
    const user = await fetchuser("testusername"); // replace with a real username
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
