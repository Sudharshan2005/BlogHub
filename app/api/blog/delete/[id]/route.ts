import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid Blog ID format' }, { status: 400 });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 201 });

  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
