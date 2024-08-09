import { PrismaClient } from '@prisma/client';
import {refreshJWT} from "@/app/api/users/userService";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { refreshToken }: { refreshToken: string } = await request.json();

    const user = await prisma.user.findFirst({
      where: { refreshToken }
    })

    if (!user) {
      return Response.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    const newToken = refreshJWT(user)

    return Response.json({ token: newToken })
  } catch (error: any) {
    if (error.hasOwnProperty('status')) {
      return Response.json(error, {status: error.status})
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}