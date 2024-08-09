import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const prisma = new PrismaClient();

export async function loadUserFromJWT(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw { error: 'Authorization header missing or invalid', status: 401 };
  }

  const token = authHeader.split(' ')[1];

  let user;
  try {
    let decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userId = decoded.userId as string;
    user = await prisma.user.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        isAdmin: true,
        gold: true,
        usd: true
      },
    });
  } catch (err) {
    throw { error: 'Invalid token', status: 401 };
  }

  if (!user) {
    throw { error: 'User not found', status: 404 };
  }

  return user;
}

export function createJWT(user: { userId: string }) {
  const token = jwt.sign({ userId: user.userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ userId: user.userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });

  return { token, refreshToken }
}


export function refreshJWT(user: { userId: string, refreshToken: string | null }) {
  if (!user.refreshToken) throw { error: 'Invalid refresh token', status: 401 };

  try {
    jwt.verify(user.refreshToken, REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw { error: 'Expired refresh token' , status: 401 }
  }

  return jwt.sign({ userId: user.userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}