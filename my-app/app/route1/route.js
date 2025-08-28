import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("sample_db");
  const orders = db.collection("orders");

  if (req.method === "POST") {
    const { itemName, quantity } = req.body;
    const result = await orders.insertOne({
      itemName,
      quantity,
      status: "pending",
      createdAt: new Date(),
    });
    res.json(result);
  } else if (req.method === "GET") {
    const data = await orders.find({}).toArray();
    res.json(data);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

export async function GET(req) {
    return Response.json({ message: "Hello from Route 1 and render service" });
}