import LogRepository from './LogRepository.js';
import prismaClient from '../client/PrismaClientFactory.js'
 
class PrismaLogRepository extends LogRepository {
  async create(log) {
    const created = await prismaClient.address_logs.create({
      data: {
        address_id: log.addressId,
        user_id: log.userId,
        operation: log.operation,
        changed_data: log.changedData,
      },
    });
 
    return created.id;
  }
}
 
export default PrismaLogRepository;
 