import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Blog from "@/models/Blog";

export async function POST(req: Request) {
    try {
        connectDB();

        const  {
            title,
            excerpt,
            content,
            author,
            tags,
            category,
            slug,
            published,
            scheduledFor,
            createdAt
          } = await req.json();

          if(!title || !excerpt || !content || !author || !tags || !category || !slug || !createdAt) {
            return NextResponse.json({ message: "Missing Feilds" }, { status: 400 });
          }

          const existingBlog = await Blog.findOne({ slug });
          if(existingBlog) {
            return NextResponse.json({ message: "Slug is already exist!" }, { status: 409 });
          }

          console.log(scheduledFor)

          const blog = await Blog.create({ title, excerpt, content, author, tags, category, slug, published, scheduledFor, createdAt });

          return NextResponse.json({ message: "Blog Created Successfully", blog }, { status: 201 });
    } catch(error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}