import jwt from 'jsonwebtoken';
import UnauthorizedException from '../../application/exceptions/UnauthorizedException.js';

const JWT_SECRET = process.env.JWT_SECRET;

class AuthMiddleware {
  handle(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('Token not provided');
      }

      const [scheme, token] = authHeader.split(' ');

      if (scheme !== 'Bearer' || !token) {
        throw new UnauthorizedException('Malformed token');
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      req.userId = decoded.userId;

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}

export default new AuthMiddleware();