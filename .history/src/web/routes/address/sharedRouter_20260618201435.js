import { Router } from "express";
import addressController from "../../../modules/address/";
 
const router = Router();
 
router.get("/:token", addressController.getShared);
 
export default router;