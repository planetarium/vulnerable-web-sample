import {loadUserFromJWT} from "@/app/api/users/userService";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const user = await loadUserFromJWT(request)
    const { voucherId }: { voucherId: number } = await request.json();
    if (!voucherId || isNaN(Number(voucherId))) {
      return Response.json({ error: 'Invalid or missing voucherId' }, { status: 400 });
    }
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
    });

    if (!voucher) {
      return Response.json({ error: 'Voucher not found' }, { status: 404 });
    }

    if (voucher.userId !== user.id) {
      return Response.json({ error: 'It is not your voucher' }, { status: 403 });
    }

    if (voucher.status === 'COMPLETED') {
      return Response.json({ error: 'Voucher already completed' }, { status: 400 });
    }

    await prisma.voucher.update({
      where: { id: voucherId },
      data: { status: 'COMPLETED' },
    });

    await prisma.user.update({
      where: { id: voucher.userId },
      data: { gold: { increment: voucher.gold } },
    });

    return Response.json({ voucher }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    if (error.hasOwnProperty('status')) {
      return Response.json(error, {status: error.status})
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}