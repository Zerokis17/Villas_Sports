import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getEvents,
  getEvent,
  createEvent,
  deleteEvent,
  updateEvent,
} from "../controllers/event.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createEventSchema } from "../schemas/event.schema.js"; //falta agregar para el resto de rutas
const router = Router();

router.get("/", authRequired, getEvents);
router.get("/:id", authRequired, getEvent);  
router.post("/", authRequired, validateSchema(createEventSchema), createEvent);  
router.put("/:id", authRequired, validateSchema(createEventSchema), updateEvent);
router.delete("/:id", authRequired, deleteEvent);

export default router;
