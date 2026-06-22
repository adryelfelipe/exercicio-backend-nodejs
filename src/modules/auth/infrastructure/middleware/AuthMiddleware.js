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
      if (error.name === 'TokenExpiredError') {
        return next(new UnauthorizedException('Token expired'));
      }

      if (error.name === 'JsonWebTokenError') {
        return next(new UnauthorizedException('Invalid token'));
      }

      next(error);
    }
  }
}

export default new AuthMiddleware();