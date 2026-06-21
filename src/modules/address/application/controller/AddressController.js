import CreateAddressRequest from "../dto/CreateAddressRequest.js";
import UpdateAddressRequest from "../dto/UpdateAddressRequest.js";
import addressService from "../service/AddressService.js";
import { ZodError } from "zod";
import {
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
  sharedTokenParamSchema,
  findAllAddressQuerySchema,
  shareAddressSchema,
} from "../schema/addressSchema.js"

class AddressController {
  async create(req, res, next) {
    try {
      const data = createAddressSchema.parse(req.body);
      const createAddressRequest = new CreateAddressRequest(data);
      const id = await addressService.create(createAddressRequest, req.userId);
      res.status(201).location(`/addresses/${id}`).json({ id });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const { keyword } = findAllAddressQuerySchema.parse(req.query);
      const addresses = await addressService.findAll(req.userId, keyword);
      res.status(200).json(addresses);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = addressIdParamSchema.parse(req.params);
      const data = updateAddressSchema.parse(req.body);
      const updateAddressRequest = new UpdateAddressRequest(data);
      const address = await addressService.update(id, updateAddressRequest, req.userId);
      res.status(200).json(address);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = addressIdParamSchema.parse(req.params);
      await addressService.delete(id, req.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async share(req, res, next) {
    try {
      const { id } = addressIdParamSchema.parse(req.params);
      const { expiresIn } = shareAddressSchema.parse(req.body);
      const sharedUrl = await addressService.share(id, req.userId, expiresIn);
      res.status(200).json(sharedUrl);
    } catch (error) {
      next(error);
    }
  }

  async getShared(req, res, next) {
    try {
      const { token } = sharedTokenParamSchema.parse(req.params);
      const address = await addressService.getShared(token);
      res.status(200).json(address);
    } catch (error) {
      next(error);
    }
  }
}

export default new AddressController();