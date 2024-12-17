import { NextResponse } from "next/server";
import { addTestDoc, fetchTestDocs } from "@/lib/firebaseConnection";

export async function GET() {
  try {
    // הוספת מסמך לדוגמה
    await addTestDoc();

    // קריאת מסמכים
    await fetchTestDocs();

    return NextResponse.json({ message: "Firebase test completed successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Error during Firebase test." }, { status: 500 });
  }
}
