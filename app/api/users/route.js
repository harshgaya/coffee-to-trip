import { getDb } from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const gender = searchParams.get("gender") || "";
    const tripIntent = searchParams.get("tripIntent") || "";
    const groupPref = searchParams.get("groupPref") || "";

    const db = await getDb();
    const collection = db.collection("signups");

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    if (gender) query.gender = gender;
    if (tripIntent) query.tripIntent = tripIntent;
    if (groupPref) query.groupPreference = groupPref;

    const users = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = users.map((u) => ({
      ...u,
      _id: u._id.toString(),
    }));

    return Response.json({ success: true, data: serialized });
  } catch (error) {
    console.error("Fetch users error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ success: false, error: "ID required" }, { status: 400 });
    }

    const { ObjectId } = await import("mongodb");
    const db = await getDb();
    const collection = db.collection("signups");

    await collection.deleteOne({ _id: new ObjectId(id) });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
