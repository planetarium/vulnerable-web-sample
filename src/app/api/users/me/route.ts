import {loadUserFromJWT} from "@/app/api/users/userService";


export async function GET(request: Request) {
  try {
    const user = await loadUserFromJWT(request)
    return Response.json(user)
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    if (error.hasOwnProperty('status')) {
      return Response.json(error, {status: error.status})
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}