import {loadUserFromJWT} from "@/app/api/users/userService";
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const user = await loadUserFromJWT(request)
    const vouchers = await prisma.voucher.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        gold: true,
        status: true,
        createdAt: true,
      },
    });

    return Response.json(vouchers, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    if (error.hasOwnProperty('status')) {
      return Response.json(error, {status: error.status})
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}