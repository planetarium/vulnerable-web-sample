import {loadUserFromJWT} from "@/app/api/users/userService";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const user = await loadUserFromJWT(request)
    const { gold }: { gold: number } = await request.json();

    if (gold > user.gold || gold < 0) {
      return Response.json({ error: 'Invalid gold amount' }, { status: 400 });
    }

    const price = await (await fetch('https://api.9cscan.com/price')).json()
    let goldPrice = price.quote.USD.price
    let usd = gold * goldPrice

    const result = await prisma.user.update({
      where: { id: user.id },
      data: { gold: { decrement: gold }, usd: { increment: usd }}
    })

    return Response.json({ result }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    if (error.hasOwnProperty('status')) {
      return Response.json(error, {status: error.status})
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}