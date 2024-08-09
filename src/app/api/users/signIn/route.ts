import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import {createJWT} from "@/app/api/users/userService";

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const prisma = new PrismaClient();


export async function POST(request: Request) {
  try {
    const { userId, password }: { userId: string; password: string } = await request.json();

    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return Response.json({ error: 'Invalid userId or password' }, { status: 401 });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return Response.json({ error: 'Invalid userId or password' }, { status: 401 });
    }

    const { token, refreshToken } = createJWT(user)

    await prisma.user.update({
      where: { userId: user.userId },
      data: { refreshToken },
    });

    return Response.json({ token, refreshToken });
  } catch (error: any) {
    if (error.hasOwnProperty('status')) {
      return Response.json(error, {status: error.status})
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}