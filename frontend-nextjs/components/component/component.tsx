"use client";

import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function Component() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("Generated text will appear here...");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }

    console.log(file, image);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        "https://backend-hono.shivanandasai-38.workers.dev/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image.");
      }

      const data = await response.json();
      setText(data.description);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Image to Text
          </h1>
          <p className="max-w-md text-muted-foreground dark:text-muted-foreground-dark">
            Upload an image and we'll convert it to text for you.
          </p>
          <div>
            <label
              htmlFor="file-upload"
              className="outline inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <UploadIcon className="mr-2 h-5 w-5" />
              Upload Image
            </label>
            <input
              id="file-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <button
            onClick={handleUpload}
            className="outline inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Uploading..." : "CLICK TO GENERATE"}
          </button>
        </div>
        <div className="mt-12 w-full max-w-2xl rounded-md border border-input bg-background p-4 shadow-sm dark:border-input-dark">
          <Textarea
            placeholder={text}
            className="h-40 w-full resize-none border-0 p-0 text-sm focus:ring-0 text-black"
            readOnly
            value={text}
          />
        </div>
      </main>
    </div>
  );
}

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
