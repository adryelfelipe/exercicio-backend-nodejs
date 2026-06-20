import CreateAddressRequest from "../dto/CreateAddressRequest.js";
import UpdateAddressRequest from "../dto/UpdateAddressRequest.js";
import addressService from "../service/AddressService.js";

class AddressController {
  async create(req, res) {
    const createAddressRequest = new CreateAddressRequest({
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      neighborhood: req.body.neighborhood,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
    });

    try {
      const id = await addressService.create(createAddressRequest, req.userId);

      res.status(201).location(`/addresses/${id}`).json({ id });
    } catch (error) {
      res.status(500).send();
    }
  }

  async findAll(req, res) {
      const addresses = await addressService.findAll(req.userId, req.query.keyword);
      res.status(200).json(addresses);
   
  }

  async update(req, res) {
    const updateAddressRequest = new UpdateAddressRequest({
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      neighborhood: req.body.neighborhood,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
    });

    const address = await addressService.update(req.params.id, updateAddressRequest, req.userId);

    res.status(200).json(address);
  }

  async delete(req, res) {
    await addressService.delete(req.params.id, req.userId);

    res.status(200).json({ message: "Address deleted" });
  }

  async share(req, res) {
    const sharedUrl = await addressService.share(req.params.id, req.userId, req.body.expiresIn);

    res.status(200).json(sharedUrl);
  }

  async getShared(req, res) {
    const address = await addressService.getShared(req.params.token);

    res.status(200).json(address);
  }
}

export default new AddressController();