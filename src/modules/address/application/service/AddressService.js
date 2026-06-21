import addressMapper from '../mapper/AddressMapper.js';
import prismaAddressRepository from "../../infrastructure/repository/PrismaAddressRepository.js"
import AddressNotFoundException from "../exceptions/AddressNotFoundException.js"

 
class AddressService {
  async create(createAddressRequest, userId) {
    const address = addressMapper.toAddress(createAddressRequest, userId);

    const id = prismaAddressRepository.create(address)

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
 
    // falta: registrar log da alteração (dados modificados + id do usuário)
 
    return addressMapper.toResponse(updated);
  }
 
 async delete(id, userId) {
    const address = await prismaAddressRepository.findById(Number(id));
 
    if (!address || address.user_id !== userId) {
      throw new AddressNotFoundException();
    }
 
    await prismaAddressRepository.delete(Number(id));
 
    // falta: registrar log da exclusão (dados removidos + id do usuário)
  }
 
  async share(id, userId, expiresIn) {
    // falta repositório: buscar endereço e validar se pertence ao userId
    // falta: gerar token JWT com o id do endereço e validade (expiresIn)
    // falta: montar e retornar a URL com o token gerado
  }
 
  async getShared(token) {
    // falta: validar/decodificar o token JWT (jwt.verify)
    // falta: se expirado ou inválido, lançar erro
    // falta repositório: buscar endereço pelo id contido no token
  }
}
 
export default new AddressService();