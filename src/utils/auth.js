import jwt from 'jsonwebtoken';

export function getTokenCookie(req) {
  const token = req.cookies.authToken;
  if (!token) return null;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decodedToken.username;
  } catch (error) {
    return null;
  }
}

export function deleteTokenCookie(res) {
  res.setHeader('Set-Cookie', 'authToken=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
}