import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Blog from "@/models/Blog";

export async function GET(req: Request) {
    try {
        connectDB();

        const blogs = await Blog.find().populate('author');

        if(!blogs || blogs.length == 0) {
            return NextResponse.json({ message: "Blogs Not Found." }, { status: 401 });
        }

        return NextResponse.json({ message: "Fetched Blogs", blogs }, { status: 201 });
    } catch(error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}