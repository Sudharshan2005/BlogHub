import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      await connectDB();
  
      const { id } = await params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
      }
  
      const Id = new mongoose.Types.ObjectId(id);
  
      const blog = await Blog.findById(Id);
  
      if (!blog) {
        return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Blog fetched successfully', blog }, { status: 201 });
  
    } catch (error) {
      console.error('Error fetching blog:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
  