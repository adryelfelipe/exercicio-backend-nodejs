import AddressRepository from '../../domain/address/AddressRepository.js';
import prisma from '../prismaClient.js';

class PrismaAddressRepository extends AddressRepository {
  async create(address) {
    const created = await prisma.addresses.create({
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
    const found = await prisma.addresses.findMany({
      where: {
        user_id: userId,
        ...(keyword && {
          OR: [
            { street: { contains: keyword, mode: 'insensitive' } },
            { city: { contains: keyword, mode: 'insensitive' } },
            { neighborhood: { contains: keyword, mode: 'insensitive' } },
          ],
        }),
      },
    });

    return found;
  }

  async findById(id) {
    const found = await prisma.addresses.findUnique({
      where: { id },
    });

    return found;
  }

  async update(id, address) {
    const updated = await prisma.addresses.update({
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
    await prisma.addresses.delete({
      where: { id },
    });
  }
}

export default PrismaAddressRepository;