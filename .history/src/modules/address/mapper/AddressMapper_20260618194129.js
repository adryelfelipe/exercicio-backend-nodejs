import Address from '""
import AddressResponse from '../dto/AddressResponse.js';
 
class AddressMapper {
  toAddress(request, userId) {
    return new Address({
      street: request.street,
      number: request.number,
      complement: request.complement,
      neighborhood: request.neighborhood,
      city: request.city,
      state: request.state,
      zipCode: request.zipCode,
      userId,
    });
  }
 
  toResponse(address) {
    return new AddressResponse({
      id: address.id,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });
  }
 
  toResponseList(addresses) {
    return addresses.map((address) => this.toResponse(address));
  }
}
 
export default new AddressMapper();
 