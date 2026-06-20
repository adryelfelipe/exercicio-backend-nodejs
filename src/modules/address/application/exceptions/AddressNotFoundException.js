class AddressNotFoundException extends Error {
  constructor(message = 'Address not found') {
    super(message);
    this.name = 'AddressNotFoundException';
    this.statusCode = 404;
  }
}

export default AddressNotFoundException;