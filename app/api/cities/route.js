import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const cities = await db
      .collection("cities")
      .find({})
      .sort({ name: 1 })
      .toArray();
    return Response.json({
      success: true,
      data: cities.map((c) => ({ ...c, _id: c._id.toString() })),
    });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name } = await req.json();
    if (!name?.trim()) {
      return Response.json(
        { success: false, error: "City name required" },
        { status: 400 },
      );
    }
    const db = await getDb();
    const existing = await db.collection("cities").findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });
    if (existing) {
      return Response.json(
        { success: false, error: "City already exists" },
        { status: 400 },
      );
    }
    await db.collection("cities").insertOne({
      name: name.trim(),
      createdAt: new Date(),
    });
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ success: false }, { status: 400 });
    const { ObjectId } = await import("mongodb");
    const db = await getDb();
    await db.collection("cities").deleteOne({ _id: new ObjectId(id) });
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
