import {loadUserFromJWT} from "@/app/api/users/userService";
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const me = await loadUserFromJWT(request)
    if (!me.isAdmin) return Response.json({error: 'Forbidden'}, {status: 403})

    const { userId, gold }: { userId: number; gold: number } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const voucher = await prisma.voucher.create({
      data: {
        userId,
        gold,
        status: 'ISSUED',
        createdAt: new Date(),
      },
    });

    return Response.json(voucher, { status: 201 });

  } catch (error: any) {
    if (error.hasOwnProperty('status')) {
      return Response.json(error, {status: error.status})
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}