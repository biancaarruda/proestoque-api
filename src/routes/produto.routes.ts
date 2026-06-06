import { Router } from "express";

import { ProdutoController } from "../controllers/produto.controller";
import { MovimentacaoController } from "../controllers/movimentacao.controller";
import { autenticar } from "../middlewares/auth";

const routes = Router();

const controller = new ProdutoController();
const movimentacaoController = new MovimentacaoController();

routes.use(autenticar);

routes.get("/", controller.index);

routes.get("/:id", controller.show);

routes.post("/", controller.create);

routes.put("/:id", controller.update);

routes.delete("/:id", controller.delete);

routes.post("/:id/movimentacao", movimentacaoController.create);

routes.get("/:id/movimentacoes", movimentacaoController.index);

export { routes as produtoRoutes };