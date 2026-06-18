import addressMapper from '../mapper/AddressMapper.js';
 
class AddressService {
  create(createAddressRequest, userId) {
    const address = addressMapper.toAddress(createAddressRequest, userId);
 
    return addressMapper.toResponse(address);
  }
 
  findAll(addresses) {
    return addressMapper.toResponseList(addresses);
  }
 
  update(id, updateAddressRequest, userId) {
    const address = addressMapper.toAddress(updateAddressRequest, userId);
    address.id = id;
 
    return addressMapper.toResponse(address);
  }
 
  delete(id, userId) {
    return { id, userId };
  }
 
  share(id, userId, expiresIn) {
    return { id, userId, expiresIn };
  }
 
  getShared(token) {
    return { token };
  }
}
 
export default new AddressService();
 