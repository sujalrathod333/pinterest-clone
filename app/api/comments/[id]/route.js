import { connectDB } from "@/libs/mongodb";
import { getToken } from "next-auth/jwt";
import Pin from "@/models/pin";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    await connectDB();

    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const pin = await Pin.findById(id);

    if (!pin) {
      return NextResponse.json(
        {
          success: false,
          message: "Pin not found",
        },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const user = formData.get("user");
    const comment = formData.get("comment");
    const profileImage =
      formData.get("profileImage");

    const newComment = {
      user,
      comment,
      profileImage,
    };

    pin.comments.push(newComment);

    await pin.save();

    return NextResponse.json(
      {
        success: true,
        message: "Comment added successfully",
        comment: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add comment",
      },
      { status: 500 }
    );
  }
}
