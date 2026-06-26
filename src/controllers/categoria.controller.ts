import { Request, Response } from "express";

import { prisma } from "../prisma/client";

export class CategoriaController {
  async index(request: Request, response: Response) {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    return response.json(categorias);
  }

  async show(request: Request, response: Response) {
    const id = String(request.params.id);

    const categoria = await prisma.categoria.findUnique({
      where: {
        id,
      },
    });

    return response.json(categoria);
  }

  async create(request: Request, response: Response) {
    const { nome, icone, cor } = request.body;

    const categoria = await prisma.categoria.create({
      data: {
        nome,
        icone,
        cor,
      },
    });

    return response.status(201).json(categoria);
  }
}