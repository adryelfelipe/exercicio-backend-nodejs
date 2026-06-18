import { Router } from "express";
import addressController from "../../../modules/address/application/controller/AddressController.js";
 
const router = Router();
 
router.get("/:token", addressController.getShared);
 
export default router;