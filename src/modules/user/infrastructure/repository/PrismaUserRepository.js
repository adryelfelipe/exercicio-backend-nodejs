import UserRepository from '../../domain/repository/UserRepository.js';
import prisma from '../../../../shared/infrastructure/client/PrismaClientFactory.js';
 
class PrismaUserRepository extends UserRepository {
  async create(user) {
    const created = await prisma.users.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
 
    return created.id;
  }
 
  async findByEmail(email) {
    const found = await prisma.users.findUnique({
      where: { email },
    });
 
    return found;
  }
 
  async findById(id) {
    const found = await prisma.users.findUnique({
      where: { id },
    });
 
    return found;
  }
}
 
export default new PrismaUserRepository();
 