import { Router } from "express";

import { MovimentacaoController } from "../controllers/movimentacao.controller";
import { autenticar } from "../middlewares/auth";

const routes = Router();

const controller = new MovimentacaoController();

routes.use(autenticar);

routes.get("/", controller.index);
routes.post("/", controller.create);

export { routes as movimentacaoRoutes };