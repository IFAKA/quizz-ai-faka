"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function UploadDoc() {
  const [document, setDocument] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!document) {
      setError("Please upload the document first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("pdf", document as Blob);
    try {
      const response = await fetch("/api/quizz/generate", {
        method: "POST",
        body: formData,
      });
      if (response.status === 200) {
        const data = await response.json();
        const quizzId = data.quizzId;

        router.push(`/quizz/${quizzId}`);
      }
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument(file);
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form
          className="w-full grid gap-3"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="document"
            className="bg-secondary w-full flex h-20 rounded-md border-4 border-dashed border-blue-900 relative"
          >
            <div className="absolute inset-0 m-auto flex justify-center items-center">
              {document && document?.name ? document.name : "Upload"}
            </div>
            <input
              type="file"
              id="document"
              accept="application/pdf"
              className="relative block w-full h-full z-50 opacity-0"
              onChange={handleDocumentUpload}
            />
          </label>
          {error ? <p className="text-red-600">{error}</p> : null}
          <Button
            size="lg"
            type="submit"
          >
            Generate
          </Button>
        </form>
      )}
    </div>
  );
}

export default UploadDoc;
