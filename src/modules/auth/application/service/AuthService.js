import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import authMapper from '../mapper/AuthMapper.js';
import UserRepository from '../../../user/domain/repository/UserRepository.js';
import prismaUserRepository from '../../../user/infrastructure/repository/PrismaUserRepository.js'
import EmailAlreadyUsedException from '../exceptions/EmailAlreadyUsedException.js';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException.js';

/** @type {UserRepository} */
const userRepository = prismaUserRepository;

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';

class AuthService {
  async register(registerRequest) {
    const existingUser = await userRepository.findByEmail(registerRequest.email);

    if (existingUser) {
      throw new EmailAlreadyUsedException(registerRequest.email);
    }

    const user = authMapper.toUser(registerRequest);

    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);

    const id = await userRepository.create(user);

    return id;
  }

  async login(loginRequest) {
    const user = await userRepository.findByEmail(loginRequest.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const passwordMatches = await bcrypt.compare(loginRequest.password, user.password);

    if (!passwordMatches) {
      throw new InvalidCredentialsException();
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return token;
  }
}

export default new AuthService();