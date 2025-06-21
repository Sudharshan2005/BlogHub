import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      await connectDB();
  
      const { id } = await params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
      }
  
      const Id = new mongoose.Types.ObjectId(id);
  
      const user = await User.findById(Id);
  
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'User fetched successfully', user }, { status: 201 });
  
    } catch (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
  