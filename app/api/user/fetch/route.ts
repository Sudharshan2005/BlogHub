import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        await connectDB();

        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Authorization header missing or invalid' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        if (typeof decoded !== 'object' || !('userId' in decoded)) {
            return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
        }

        const user = await User.findById(decoded.userId);

        return NextResponse.json({ message: "Fetched data successfully", user }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}