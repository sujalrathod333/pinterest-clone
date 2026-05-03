"use client";

import Comments from "@/app/components/Comments";
import axios from "axios";
import { Heart, Send, Download } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const Pin = () => {
  const { id } = useParams();
  const { data: session } = useSession();

  const [pin, setPin] = useState(null);
  const [morePins, setMorePins] = useState([]);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  /* ==========================
     FETCH CURRENT PIN
  ========================== */
  const fetchPin = async () => {
    try {
      const res = await axios.get(`/api/pin/${id}`);

      const pinData = res.data.pin;

      setPin(pinData);

      const liked = pinData.likes?.some(
        (item) => item.user === session?.user?.name
      );

      setIsLiked(liked || false);
    } catch (error) {
      console.log(error);
    }
  };

  /* ==========================
     FETCH MORE PINS
  ========================== */
  const fetchMorePins = async () => {
    try {
      const res = await axios.get("/api/pin");

      const filtered = res.data.pins.filter(
        (item) => item._id !== id
      );

      setMorePins(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  /* ==========================
     LIKE / UNLIKE
  ========================== */
  const handleLike = async () => {
    try {
      setLikeLoading(true);

      const res = await axios.post(`/api/like/${id}`);

      toast.success(res.data.message);

      await fetchPin();
    } catch (error) {
      toast.error("Failed to like/unlike pin");
      console.log(error);
    } finally {
      setLikeLoading(false);
    }
  };

  /* ==========================
     POST COMMENT
  ========================== */
  const handlePostComment = async () => {
  if (!session?.user) {
    toast.error("Please login first");
    return;
  }

  if (!comment.trim()) {
    toast.error("Please write a comment");
    return;
  }

  try {
    setCommentLoading(true);

    const formData = new FormData();

    formData.append("user", session.user.name || "");
    formData.append("profileImage", session.user.image || "");
    formData.append("comment", comment.trim());

    const res = await axios.post(
      `/api/comments/${id}`,
      formData
    );

    if (res.status === 201 || res.status === 200) {
      toast.success(res.data.message);

      setComment("");

      await fetchPin();
    }
  } catch (error) {
    console.log(error);
    toast.error(
      error?.response?.data?.message ||
        "Failed to post comment"
    );
  } finally {
    setCommentLoading(false);
  }
};


  /* ==========================
     LOAD DATA
  ========================== */
  useEffect(() => {
    const loadData = async () => {
      if (!id || !session) return;

      setLoading(true);

      await Promise.all([
        fetchPin(),
        fetchMorePins(),
      ]);

      setLoading(false);
    };

    loadData();
  }, [id, session]);

  /* ==========================
     LOADER
  ========================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#ef4444" size={120} />
      </div>
    );
  }

  /* ==========================
     UI
  ========================== */
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Card */}
        <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl p-5 md:p-8">
          {/* LEFT IMAGE */}
          <div className="flex justify-center">
            <Image
              src={pin?.image?.url}
              alt={pin?.title}
              width={700}
              height={800}
              priority
              className="rounded-3xl object-cover max-h-[750px] w-auto shadow-lg"
            />
          </div>

          {/* RIGHT SIDE */}
          <div>
            {/* ACTIONS */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                  isLiked
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-black hover:bg-red-100"
                }`}
              >
                <Heart
                  size={22}
                  fill={isLiked ? "white" : "none"}
                />
              </button>

              <Link
                href={pin?.image?.url}
                target="_blank"
                className="bg-red-500 text-white px-5 py-3 rounded-full font-semibold hover:bg-red-600 transition flex items-center gap-2"
              >
                <Download size={18} />
                Download
              </Link>
            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-bold mb-3">
              {pin?.title}
            </h1>

            {/* DESCRIPTION */}
            <p className="text-gray-600 mb-5 text-lg">
              {pin?.description}
            </p>

            {/* STATS */}
            <div className="flex gap-6 mb-6 font-medium text-gray-700">
              <span>
                {pin?.likes?.length || 0} Likes
              </span>

              <span>
                {pin?.comments?.length || 0} Comments
              </span>
            </div>

            {/* TAGS */}
            {pin?.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {pin.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* COMMENTS */}
            <h2 className="text-2xl font-bold mb-4">
              Comments
            </h2>

            <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
              {pin?.comments?.length > 0 ? (
                pin.comments.map((item) => (
                  <Comments
                    key={item._id}
                    user={item.user}
                    comment={item.comment}
                    profileImage={item.profileImage}
                  />
                ))
              ) : (
                <p className="text-gray-500">
                  No comments yet
                </p>
              )}
            </div>

            {/* ADD COMMENT */}
            <div className="mt-5 relative">
              <input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handlePostComment()
                }
                className="w-full bg-gray-100 rounded-full py-3 px-5 pr-14 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <button
                onClick={handlePostComment}
                disabled={commentLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white w-10 h-10 rounded-full flex justify-center items-center hover:bg-red-600 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* MORE TO EXPLORE */}
        <div className="mt-14">
          <h2 className="text-3xl font-bold mb-6">
            More to Explore
          </h2>

          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
            {morePins.map((item) => (
              <Link
                key={item._id}
                href={`/pin/${item._id}`}
                className="block break-inside-avoid group"
              >
                <Image
                  src={item?.image?.url}
                  alt={item?.title}
                  width={300}
                  height={400}
                  className="w-full rounded-2xl shadow-md group-hover:scale-[1.02] transition duration-300"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pin;
