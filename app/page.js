"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Search, Heart, ImageIcon } from "lucide-react";

export default function Home() {
  const [pins, setPins] = useState([]);

  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  /* ==========================
     FETCH PINS
  ========================== */
  const getPins = async () => {
    try {
      setLoading(true);

      const url = search
        ? `/api/pin?search=${encodeURIComponent(search)}`
        : "/api/pin";

      const res = await axios.get(url);

      setPins(res.data.pins || []);
    } catch (error) {
      console.log(error);
      setPins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPins();
  }, [search]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* SEARCH TITLE */}
        {search && !loading && (
          <div className="mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Search size={28} className="text-red-500" />
              Results for:
              <span className="text-red-500">{search}</span>
            </h2>

            <p className="text-gray-500 mt-1">{pins.length} pins found</p>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
            <ClipLoader color="#ef4444" size={70} />

            <p className="text-gray-500 font-medium">Loading pins...</p>
          </div>
        ) : pins.length > 0 ? (
          <>
            {/* TITLE */}
            {!search && (
              <div className="mb-6">
                <h1 className="text-4xl font-bold">Discover Ideas</h1>

                <p className="text-gray-500 mt-1">
                  Explore trending inspirations
                </p>
              </div>
            )}

            {/* GRID */}
            <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {pins.map((item) => (
                <Link
                  key={item._id}
                  href={`/pin/${item._id}`}
                  className="relative block group break-inside-avoid"
                >
                  <div className="overflow-hidden rounded-2xl shadow-sm bg-white">
                    <Image
                      src={item?.image?.url}
                      alt={item.title}
                      width={500}
                      height={500}
                      className="w-full h-auto object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/30 transition duration-300 flex flex-col justify-between p-3">
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition">
                      
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition text-white">
                      <p className="font-semibold truncate">{item.title}</p>

                      <div className="flex items-center gap-2 text-sm mt-1">
                        <Heart size={14} />
                        {item?.likes?.length || 0}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          /* EMPTY */
          <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4">
            <div className="w-24 h-24 rounded-full bg-red-100 flex justify-center items-center mb-5">
              <ImageIcon size={40} className="text-red-500" />
            </div>

            <h3 className="text-3xl font-bold mb-2">No Results Found</h3>

            <p className="text-gray-500 max-w-md">
              We couldn’t find any pins for{" "}
              <span className="font-semibold text-black">{search}</span>. Try
              another keyword.
            </p>

            <Link
              href="/"
              className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              Explore Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
