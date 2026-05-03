import { connectDB } from "@/libs/mongodb";
import Pin from "@/models/pin";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    await connectDB();
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const pin = await Pin.findById(id);

    if (!pin) {
      return NextResponse.json(
        { success: false, message: "Pin not found" },
        { status: 404 },
      );
    }

    const userLikedIndex = pin.likes.findIndex(like=> like.user === token.name);
    if(userLikedIndex !== -1){
        pin.likes.splice(userLikedIndex, 1);
        await pin.save();
        return NextResponse.json({success: true, message: "Pin unliked successfully"}, {status: 200})
    }  else {
        pin.likes.push({user: token.name});
        await pin.save();
        return NextResponse.json({success: true, message: "Pin liked successfully"}, {status: 200})
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to like/unlike pin" },
      { status: 500 },
    );
  }
}
