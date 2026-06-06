import { Router } from "express";

import { CategoriaController } from "../controllers/categoria.controller";
import { autenticar } from "../middlewares/auth";

const routes = Router();

const controller = new CategoriaController();

routes.use(autenticar);

routes.get("/", controller.index);

routes.get("/:id", controller.show);

routes.post("/", controller.create);

export { routes as categoriaRoutes };