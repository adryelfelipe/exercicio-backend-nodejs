import CreateAddressRequest from "../";
import UpdateAddressRequest from "../dto/UpdateAddressRequest.js";
import addressService from "../service/AddressService.js";
 
class AddressController {
  create(req, res) {
    const createAddressRequest = new CreateAddressRequest({
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      neighborhood: req.body.neighborhood,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
    });
 
    const address = addressService.create(createAddressRequest, req.userId);
 
    res.status(200).json(address);
  }
 
  findAll(req, res) {
    const addresses = addressService.findAll(req.userId, req.query.keyword);
 
    res.status(200).json(addresses);
  }
 
  update(req, res) {
    const updateAddressRequest = new UpdateAddressRequest({
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      neighborhood: req.body.neighborhood,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
    });
 
    const address = addressService.update(req.params.id, updateAddressRequest, req.userId);
 
    res.status(200).json(address);
  }
 
  delete(req, res) {
    addressService.delete(req.params.id, req.userId);
 
    res.status(200).json({ message: "Address deleted" });
  }
 
  share(req, res) {
    const sharedUrl = addressService.share(req.params.id, req.userId, req.body.expiresIn);
 
    res.status(200).json(sharedUrl);
  }
 
  getShared(req, res) {
    const address = addressService.getShared(req.params.token);
 
    res.status(200).json(address);
  }
}
 
export default new AddressController();