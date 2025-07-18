"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { getDocumentById, updateContent, deleteContent } from "@/lib/api_handler";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { useRouter } from "next/navigation";

const EditorPage = () => {
  const { id } = useParams();
  // const { data: user } = useCurrentUser(); // Not used
  const [loading, setLoading] = useState(true);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentBody, setDocumentBody] = useState("");
  const [editor, setEditor] = useState<import("@tiptap/react").Editor | null>(null);
  const router = useRouter();

  // Fetch document by ID
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const numericId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id as string, 10);
    if (isNaN(numericId)) {
      toast.error("Invalid document id");
      setLoading(false);
      return;
    }
    getDocumentById({ id: numericId })
      .then((doc) => {
        console.log(doc)
        setDocumentTitle(doc.title || "");
        setDocumentBody(doc.body || "");
        // Set content in editor if already mounted
        if (editor) {
          editor.commands.setContent(doc.body || "");
        }
      })
      .catch(() => toast.error("Failed to load document"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Set content in editor when documentBody or editor changes
  useEffect(() => {
    if (editor && documentBody) {
      editor.commands.setContent(documentBody);
    }
  }, [editor, documentBody]);

  // Save handler
  const handleSave = useCallback(async () => {
    if (!id) return;
    const numericId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id as string, 10);
    if (isNaN(numericId)) {
      toast.error("Invalid document id");
      return;
    }
    try {
      await updateContent({ id: numericId, title: documentTitle, body: editor ? editor.getHTML() : documentBody });
      toast.success("Document updated!");
    } catch (e) {
      toast.error("Failed to update document " + e);
    }
  }, [id, documentTitle, documentBody, editor]);

  const handleDelete = async () => {
    if (!id) return;
    const numericId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id as string, 10);
    if (isNaN(numericId)) {
      toast.error("Invalid document id");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteContent(numericId);
      toast.success("Document deleted!");
      router.replace("/dashboard");
    } catch (e) {
      toast.error("Failed to delete document " + e);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <div className="max-w-4xl mx-auto py-8">
        <input
          className="text-3xl font-bold mb-4 bg-transparent border-none outline-none w-full text-white"
          value={documentTitle}
          onChange={e => setDocumentTitle(e.target.value)}
          placeholder="Untitled Document"
        />
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <SimpleEditor
            onContentChange={setDocumentBody}
            onEditorReady={setEditor}
            onSave={handleSave}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={handleSave}>
            Save
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;