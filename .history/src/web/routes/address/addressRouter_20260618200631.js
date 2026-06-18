import { Router } from "express";
import addressController from "../../../modules/address/application/controller"
 
const router = Router();
 
router.post("/", addressController.create);
router.get("/", addressController.findAll);
router.put("/:id", addressController.update);
router.delete("/:id", addressController.delete);
router.post("/:id/share", addressController.share);
 
export default router;