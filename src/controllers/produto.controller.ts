import { Request, Response } from "express";

import { prisma } from "../prisma/client";

export class ProdutoController {
  async index(request: Request, response: Response) {
    const produtos = await prisma.produto.findMany({
      include: {
        categoria: true,
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    return response.json(produtos);
  }

  async show(request: Request, response: Response) {
    const id = String(request.params.id);

    const produto = await prisma.produto.findUnique({
      where: {
        id,
      },
      include: {
        categoria: true,
      },
    });

    if (!produto) {
      return response.status(404).json({
        erro: "Produto não encontrado",
      });
    }

    return response.json(produto);
  }

  async create(request: Request, response: Response) {
    const {
      nome,
      categoriaId,
      quantidade,
      quantidadeMinima,
      preco,
      unidade,
      foto,
    } = request.body;

    if (
      !nome ||
      !categoriaId ||
      quantidade === undefined ||
      quantidadeMinima === undefined ||
      preco === undefined ||
      !unidade
    ) {
      return response.status(400).json({
        erro: "Campos obrigatórios não enviados",
      });
    }

    const categoriaExiste =
      await prisma.categoria.findUnique({
        where: {
          id: categoriaId,
        },
      });

    if (!categoriaExiste) {
      return response.status(404).json({
        erro: "Categoria não encontrada",
      });
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        categoriaId,
        quantidade,
        quantidadeMinima,
        preco: Number(preco),
        unidade,
        foto,
      },
      include: {
        categoria: true,
      },
    });

    return response.status(201).json(produto);
  }

  /*(request: Request, response: Response) {
    const id = String(request.params.id);

    const produtoExiste =
      await prisma.produto.findUnique({
        where: {
          id,
        },
      });

    if (!produtoExiste) {
      return response.status(404).json({
        erro: "Produto não encontrado",
      });
    }

    const produto = await prisma.produto.update({
      where: { id },
      data: {
        ...request.body,
        preco:
          request.body.preco !== undefined
            ? Number(request.body.preco)
            : undefined,
      },
      include: {
        categoria: true,
      },
    });

    return response.json(produto);
  }
    */
  async update(request: Request, response: Response) {
  const id = String(request.params.id);

  const {
    nome,
    categoriaId,
    quantidade,
    quantidadeMinima,
    preco,
    unidade,
    foto,
  } = request.body;

  const produtoExiste = await prisma.produto.findUnique({
    where: { id },
  });

  if (!produtoExiste) {
    return response.status(404).json({
      erro: "Produto não encontrado",
    });
  }

  const produto = await prisma.produto.update({
    where: { id },
    data: {
      nome,
      quantidade,
      quantidadeMinima,
      preco: Number(preco),
      unidade,
      foto,

      categoria: {
        connect: {
          id: categoriaId,
        },
      },
    },
    include: {
      categoria: true,
    },
  });

  return response.json(produto);
}

  async delete(request: Request, response: Response) {
    const id = String(request.params.id);

    const produtoExiste =
      await prisma.produto.findUnique({
        where: {
          id,
        },
      });

    if (!produtoExiste) {
      return response.status(404).json({
        erro: "Produto não encontrado",
      });
    }

    await prisma.produto.delete({
      where: {
        id,
      },
    });

    return response.status(204).send();
  }
}