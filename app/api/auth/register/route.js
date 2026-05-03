import cloudinary from "@/libs/cloudinary"
import { connectDB } from "@/libs/mongodb"
import User from "@/models/userModel"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"



export async function POST(request){
    await connectDB(); 

    try {
        const formData = await request.formData();

        const image = formData.get("image");
        const username = formData.get("username");
        const password = formData.get("password");
        const email = formData.get("email");

        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        if (!image || typeof image === "string") {
            return NextResponse.json(
                { error: "Invalid image file" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }

        const arrayBuffer = await image.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const uploadedResponse = await new Promise((resolve, reject)=>{
            cloudinary.uploader.upload_stream({}, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }).end(buffer);
        });

        if (!uploadedResponse?.secure_url) {
            throw new Error("Image upload failed");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            image: uploadedResponse.secure_url
        });

        return NextResponse.json({
            success: true,
            message: "user registered",
            user
        }, { status: 201 });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        return NextResponse.json(
            { error: error.message || "user registration failed." },
            { status: 500 }
        );
    }
}