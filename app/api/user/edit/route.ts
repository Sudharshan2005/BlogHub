import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export async function PATCH(req: Request) {
    try {
        await connectDB();

        const { id, name, email, bio, avatar } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (bio) updateData.bio = bio;
        if (avatar) updateData.avatar = avatar;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: "No fields provided to update" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return NextResponse.json({ message: "Already Registered Email" }, { status: 409 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'User updated successfully',
            user: updatedUser
        }, { status: 201 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}