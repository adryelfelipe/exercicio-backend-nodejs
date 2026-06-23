import jwt from 'jsonwebtoken';
import addressMapper from '../mapper/AddressMapper.js';
import prismaAddressRepository from "../../infrastructure/repository/PrismaAddressRepository.js"
import AddressNotFoundException from '../exceptions/AddressNotFoundException.js';
import Log from '../../../../shared/infrastructure/log/Log.js';
import LogRepository from '../../../../shared/infrastructure/log/LogRepository.js';
import PrismaLogRepository from '../../../../shared/infrastructure/log/PrismaLogRepository.js';
import UnauthorizedException from '../../../auth/application/exceptions/UnauthorizedException.js';

/** @type {LogRepository} */
const logRepository = new PrismaLogRepository();

class AddressService {
  async create(createAddressRequest, userId) {
    const address = addressMapper.toAddress(createAddressRequest, userId);

    const id = await prismaAddressRepository.create(address)

    return id;
  }

  async findAll(userId, keyword) {
    const addresses = await prismaAddressRepository.findAllByUserId(userId, keyword);

    return addressMapper.toResponseList(addresses);
  }

  async update(id, updateAddressRequest, userId) {
    const existingAddress = await prismaAddressRepository.findById(Number(id));

    if (!existingAddress || existingAddress.user_id !== userId) {
      throw new AddressNotFoundException();
    }

    const address = addressMapper.toAddress(updateAddressRequest, userId);

    const updated = await prismaAddressRepository.update(Number(id), address);

    const log = new Log({
      addressId: Number(id),
      userId,
      operation: 'PUT',
      changedData: {
        before: addressMapper.toResponse(existingAddress),
        after: addressMapper.toResponse(updated),
      },
    });

    await logRepository.create(log);

    return addressMapper.toResponse(updated);
  }

async delete(id, userId) {
  const address = await prismaAddressRepository.findById(Number(id));

  if (!address || address.user_id !== userId) {
    throw new AddressNotFoundException();
  }

  await prismaAddressRepository.delete(Number(id));

  const log = new Log({
    addressId: Number(id),
    userId,
    operation: 'DELETE',
    changedData: {
      before: addressMapper.toResponse(address),
      after: null,
    },
  });

  await logRepository.create(log);
}

  async share(id, userId, expiresIn) {
    const address = await prismaAddressRepository.findById(Number(id));

    if (!address || address.user_id !== userId) {
      throw new AddressNotFoundException();
    }

    const token = jwt.sign(
      { addressId: address.id, type:'share' },
      process.env.JWT_SECRET,
      { expiresIn: expiresIn || '1h' }
    );

    const url = `${process.env.BASE_URL}/shared/${token}`;

    return { url };
  }

  async getShared(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'share') {
      throw new UnauthorizedException('Invalid token type');
    }


    const address = await prismaAddressRepository.findById(decoded.addressId);

    if (!address) {
      throw new AddressNotFoundException();
    }

    return addressMapper.toResponse(address);
  }
}

export default new AddressService();