import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("sample_db");
    const collection = db.collection("orders");

    // Sample order
    const sampleOrder = {
      store_id: "store_123",
      customer_name: "Test User",
      customer_phone: "9999999999",
      items: [
        { name: "Maggie", qty: 2, price: 14 },
        { name: "Kurkure", qty: 1, price: 12 }
      ],
      total_price: 2 * 14 + 1 * 12,
      created_at: new Date(),
      status: "pending",
    };

    const result = await collection.insertOne(sampleOrder);

    return NextResponse.json({
      success: true,
      message: "Sample order inserted",
      orderId: result.insertedId,
    });
  } catch (err) {
    console.error("Error inserting sample order:", err);
    return NextResponse.json(
      { error: "Failed to insert sample order" },
      { status: 500 }
    );
  } finally {
    return Response.json({ message: "Hello from Route 1 and render service" });
  }
}
