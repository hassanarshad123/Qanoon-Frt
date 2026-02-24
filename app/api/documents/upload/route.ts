import { put } from "@vercel/blob";
import { requireAuth } from "@/lib/auth/api";
import { createDocumentRecord } from "@/lib/actions/documents";

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const documentType = (formData.get("documentType") as string) || "Other";
    const title = (formData.get("title") as string) || file?.name || "Untitled";

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: "File too large. Maximum size is 50MB." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = session!.user!.id!;
    const pathname = `judges/${userId}/${Date.now()}-${file.name}`;

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
    });

    const docId = await createDocumentRecord(
      {
        title,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        documentType,
        blobUrl: blob.url,
        blobPathname: blob.pathname,
      },
      userId
    );

    return new Response(
      JSON.stringify({
        id: docId,
        blobUrl: blob.url,
        fileName: file.name,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Document upload error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Upload failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
