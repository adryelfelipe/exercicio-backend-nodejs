import AddressRepository from '../../domain/repository/AddressRepository.js';
import prismaClient from '../../../../shared/infrastructure/client/PrismaClientFactory.js';

class PrismaAddressRepository extends AddressRepository {
  async create(address) {
    const created = await prismaClient.addresses.create({
      data: {
        street: address.street,
        number: address.number,
        complement: address.complement,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zip_code: address.zipCode,
        user_id: address.userId,
      },
    });

    return created.id;
  }

  async findAllByUserId(userId, keyword) {
    const where = {
      user_id: userId
    }

    if (keyword) {
      where.OR = [
        { street: { contains: keyword, mode: 'insensitive' } },
        { city: { contains: keyword, mode: 'insensitive' } },
        { neighborhood: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    const found = await prismaClient.addresses.findMany({where: where})

    return found;
  }

  async findById(id) {
    const found = await prismaClient.addresses.findUnique({
      where: { id },
    });

    return found;
  }

  async update(id, address) {
    const updated = await prismaClient.addresses.update({
      where: { id },
      data: {
        street: address.street,
        number: address.number,
        complement: address.complement,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zip_code: address.zipCode,
      },
    });

    return updated;
  }

  async delete(id) {
    await prismaClient.addresses.delete({
      where: { id },
    });
  }
}

export default new PrismaAddressRepository();