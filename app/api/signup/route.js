import { getDb } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.firstName || !body.phone) {
      return Response.json(
        { success: false, error: "First name and phone are required." },
        { status: 400 },
      );
    }

    const db = await getDb();
    const collection = db.collection("signups");

    const doc = {
      ...body,
      age: body.age ? parseInt(body.age) : null,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(doc);

    if (body.draftId) {
      try {
        await db.collection("drafts").deleteOne({ draftId: body.draftId });
      } catch {}
    }

    return Response.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
