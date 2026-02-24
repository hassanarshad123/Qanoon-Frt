import { del } from "@vercel/blob";
import { requireAuth } from "@/lib/auth/api";
import { getDocument, deleteDocument } from "@/lib/actions/documents";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const doc = await getDocument(id);

  if (!doc) {
    return new Response(JSON.stringify({ error: "Document not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(doc), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const result = await deleteDocument(id);

  if (!result) {
    return new Response(JSON.stringify({ error: "Document not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Delete from Vercel Blob
  try {
    await del(result.blobUrl);
  } catch (err) {
    console.error("Failed to delete blob:", err);
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
