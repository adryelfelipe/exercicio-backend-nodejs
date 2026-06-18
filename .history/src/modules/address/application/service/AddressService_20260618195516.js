import addressMapper from '../mapper/AddressMapper.js';
 
class AddressService {
  create(createAddressRequest, userId) {
    const address = addressMapper.toAddress(createAddressRequest, userId);
 
    return addressMapper.toResponse(address);
  }
 
  findAll(addresses) {
    return addressMapper.toResponseList(addresses);
  }
 
  update(updateAddressRequest, userId) {
    const address = addressMapper.toAddress(updateAddressRequest, userId);
 
    return addressMapper.toResponse(address);
  }
}
 
export default new AddressService();
 