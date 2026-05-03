import cloudinary from "@/libs/cloudinary";
import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Pin from "@/models/pin";

export const POST = async (req) => {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const tags = formData.get("tags");
    const image = formData.get("image");
    const user = formData.get("user");

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        { status: 400 }
      );
    }

    const tagsArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean)
      : [];

    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const uploadedResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, function (error, result) {
          if (error) return reject(error);
          resolve(result);
        })
        .end(buffer);
    });

    const pin = await Pin.create({
      user,
      title,
      description,
      tags: tagsArray,
      image: {
        url: uploadedResponse.secure_url,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pin created successfully",
        pin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error uploading image",
      },
      { status: 500 }
    );
  }
};


export const GET = async (req) => {
  try {
    await connectDB();

    const search = req.nextUrl.searchParams.get("search");

    let pins = [];

    if (search && search.trim() !== "") {
      const cleanSearch = search.trim().toLowerCase();

      const searchRegex = new RegExp(cleanSearch, "i");

      pins = await Pin.find({
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { tags: { $in: [cleanSearch] } },
        ],
      }).sort({ createdAt: -1 });
    } else {
      pins = await Pin.find().sort({ createdAt: -1 });
    }

    return NextResponse.json(
      {
        success: true,
        count: pins.length,
        pins,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch pins",
      },
      { status: 500 }
    );
  }
};
