import { getDb } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { draftId, ...data } = body;

    if (!draftId) return Response.json({ success: false });

    const db = await getDb();
    const col = db.collection("drafts");

    await col.updateOne(
      { draftId },
      { $set: { ...data, draftId, updatedAt: new Date() } },
      { upsert: true },
    );

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get("draftId");

    if (!draftId) return Response.json({ success: false });

    const db = await getDb();
    const col = db.collection("drafts");
    const draft = await col.findOne({ draftId });

    if (!draft) return Response.json({ success: false });

    const { _id, ...data } = draft;
    return Response.json({ success: true, data });
  } catch (e) {
    return Response.json({ success: false });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get("draftId");

    if (!draftId) return Response.json({ success: false });

    const db = await getDb();
    await db.collection("drafts").deleteOne({ draftId });

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false });
  }
}
