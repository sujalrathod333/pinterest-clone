"use client";

import axios from "axios";
import {
  ArrowUpFromLine,
  ImagePlus,
  Tag,
  FileText,
  Type,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const UploadPin = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const fileRef = useRef(null);

  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] =
    useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);

  /* =============================
     IMAGE HANDLER
  ============================== */
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be below 10MB");
      return;
    }

    setImage(file);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  /* =============================
     SUBMIT
  ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !image ||
      !title.trim() ||
      !description.trim() ||
      !tags.trim()
    ) {
      toast.error(
        "Please fill all fields properly"
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("image", image);
      formData.append("title", title);
      formData.append(
        "description",
        description
      );
      formData.append("tags", tags);

      if (session?.user?.name) {
        formData.append(
          "user",
          session.user.name
        );
      }

      const res = await axios.post(
        "/api/pin",
        formData
      );

      if (
        res.status === 201 ||
        res.status === 200
      ) {
        toast.success(
          "Pin uploaded successfully"
        );

        setImage("");
        setImagePreview("");
        setTitle("");
        setDescription("");
        setTags("");

        router.push("/");
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to upload pin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Create Pin
          </h1>
          <p className="text-gray-500 mt-2">
            Upload beautiful ideas and share
            inspiration.
          </p>
        </div>

        {/* Main Card */}
        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl p-5 md:p-8">
          {/* LEFT SIDE */}
          <div>
            <div
              onClick={() =>
                fileRef.current.click()
              }
              className="relative h-[500px] rounded-3xl border-2 border-dashed border-gray-300 hover:border-red-400 bg-gray-100 cursor-pointer overflow-hidden group transition"
            >
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImage}
              />

              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-black text-white flex justify-center items-center mb-4">
                    <ArrowUpFromLine size={28} />
                  </div>

                  <h2 className="text-xl font-bold mb-2">
                    Click to upload
                  </h2>

                  <p className="text-gray-500 text-sm">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* TITLE */}
            <div>
              <label className="font-semibold mb-2 flex items-center gap-2">
                <Type size={18} />
                Title
              </label>

              <input
                type="text"
                placeholder="Add title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full bg-gray-100 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="font-semibold mb-2 flex items-center gap-2">
                <FileText size={18} />
                Description
              </label>

              <textarea
                rows="5"
                placeholder="Tell everyone what this Pin is about"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                className="w-full bg-gray-100 px-4 py-3 rounded-xl outline-none resize-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* TAGS */}
            <div>
              <label className="font-semibold mb-2 flex items-center gap-2">
                <Tag size={18} />
                Tags
              </label>

              <input
                type="text"
                placeholder="nature, coding, travel"
                value={tags}
                onChange={(e) =>
                  setTags(e.target.value)
                }
                className="w-full bg-gray-100 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
              />

              <p className="text-sm text-gray-500 mt-2">
                Separate tags with commas.
              </p>
            </div>

            {/* USER */}
            {session?.user && (
              <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
                <Image
                  src={
                    session.user.image
                  }
                  alt="user"
                  width={45}
                  height={45}
                  className="rounded-full"
                />

                <div>
                  <p className="font-semibold">
                    {
                      session.user
                        .name
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    Creator
                  </p>
                </div>
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 transition text-white py-4 rounded-full font-bold text-lg flex justify-center items-center gap-2"
            >
              {loading ? (
                <ClipLoader
                  color="#fff"
                  size={22}
                />
              ) : (
                <>
                  <ImagePlus size={20} />
                  Upload Pin
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPin;
