import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, password }: { userId: string; password: string } = await request.json();

    if (await prisma.user.findUnique({
      where: { userId },
    })) {
      return Response.json({error: 'Already exists userId'}, { status: 409 })
    }

    const hashedPassword = bcrypt.hashSync(password);

    const user = await prisma.user.create({
      data: {
        userId,
        password: hashedPassword
      },
    })

    return Response.json(user, { status: 201 });
  } catch (error: any) {
    if (error.hasOwnProperty('status')) {
      return Response.json(error, {status: error.status})
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
