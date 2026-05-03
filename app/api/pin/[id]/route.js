import {connectDB} from "@/libs/mongodb";
import Pin from "@/models/pin";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    try {
        await connectDB();
        const {id} = await params;
        const pin = await Pin.findById(id);
        if(!pin) {
            return NextResponse.json({error: "Pin not found"}, {status: 404});
        }
        return NextResponse.json({success: true, pin}, {status: 200});
    } catch (error) {
        console.error("Error while fetching pin")
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}