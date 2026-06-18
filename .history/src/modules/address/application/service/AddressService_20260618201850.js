import addressMapper from '../mapper/AddressMapper.js';
 
class AddressService {
  create(createAddressRequest, userId) {
    const address = addressMapper.toAddress(createAddressRequest, userId);
 
    return addressMapper.toResponse(address);
  }
 
  findAll(userId, keyword) {
    // falta repositório: buscar endereços do usuário (com filtro por keyword)
  }
 
  update(id, updateAddressRequest, userId) {
    const address = addressMapper.toAddress(updateAddressRequest, userId);
    address.id = id;
 
    return addressMapper.toResponse(address);
  }
 
  delete(id, userId) {
    // falta repositório: remover endereço do usuário
  }
 
  share(id, userId, expiresIn) {
    // falta repositório: buscar endereço e gerar token de compartilhamento
  }
 
  getShared(token) {
    // falta repositório: buscar endereço pelo token validado
  }
}
 
export default new AddressService();