class CreateAddressRequest {
  constructor({ street, number, complement, neighborhood, city, state, zipCode }) {
    this.street = street;
    this.number = number;
    this.complement = complement;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
  }
}
 
export default CreateAddressRequest;
 