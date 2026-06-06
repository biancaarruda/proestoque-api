import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

import { prisma } from "../prisma/client";
import { AppError } from "../middlewares/errorHandler";
import { config } from "../config";

export type JwtPayload = {
  sub: string;
  nome: string;
  email: string;
};

function gerarAccessToken(usuario: {
  id: string;
  nome: string;
  email: string;
}) {
  const payload = {
    sub: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };

  return jwt.sign(
    payload,
    config.jwtSecret as Secret,
    {
      expiresIn: config.jwtExpiresIn,
    } as SignOptions
  );
}

function gerarRefreshToken(usuarioId: string) {
  return jwt.sign(
    {
      sub: usuarioId,
    },
    config.refreshSecret as Secret,
    {
      expiresIn: config.refreshExpiresIn,
    } as SignOptions
  );
}

export class AuthController {

  async registrar(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, email, senha } = req.body;

      const usuarioExistente =
        await prisma.usuario.findUnique({
          where: { email },
        });

      if (usuarioExistente) {
        throw new AppError(
          "E-mail já cadastrado",
          409
        );
      }

      const senhaHash =
        await bcrypt.hash(senha, 10);

      const usuario =
        await prisma.usuario.create({
          data: {
            nome,
            email,
            senha: senhaHash,
          },
        });

      const token =
        gerarAccessToken(usuario);

      const refreshToken =
        gerarRefreshToken(usuario.id);

      await prisma.usuario.update({
        where: {
          id: usuario.id,
        },
        data: {
          refreshToken,
        },
      });

      const {
        senha: _,
        refreshToken: __,
        ...usuarioSemSenha
      } = usuario;

      return res.status(201).json({
        usuario: usuarioSemSenha,
        token,
        refreshToken,
      });

    } catch (error) {
      next(error);
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, senha } = req.body;

      const usuario =
        await prisma.usuario.findUnique({
          where: { email },
        });

      if (!usuario) {
        throw new AppError(
          "E-mail ou senha inválidos",
          401
        );
      }

      const senhaCorreta =
        await bcrypt.compare(
          senha,
          usuario.senha
        );

      if (!senhaCorreta) {
        throw new AppError(
          "E-mail ou senha inválidos",
          401
        );
      }

      const token =
        gerarAccessToken(usuario);

      const refreshToken =
        gerarRefreshToken(usuario.id);

      await prisma.usuario.update({
        where: {
          id: usuario.id,
        },
        data: {
          refreshToken,
        },
      });

      const {
        senha: _,
        refreshToken: __,
        ...usuarioSemSenha
      } = usuario;

      return res.json({
        usuario: usuarioSemSenha,
        token,
        refreshToken,
      });

    } catch (error) {
      next(error);
    }
  }

  async perfil(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const usuario =
        await prisma.usuario.findUnique({
          where: {
            id: req.usuario?.sub,
          },
          select: {
            id: true,
            nome: true,
            email: true,
            criadoEm: true,
          },
        });

      if (!usuario) {
        throw new AppError(
          "Usuário não encontrado",
          404
        );
      }

      return res.json(usuario);

    } catch (error) {
      next(error);
    }
  }

  async refresh( req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError(
          "Refresh token obrigatório",
          401
        );
      }

      const payload = jwt.verify(
        refreshToken,
        config.refreshSecret as Secret
      ) as JwtPayload;

      const usuario =
        await prisma.usuario.findUnique({
          where: {
            id: payload.sub,
          },
        });

      if (
        !usuario ||
        usuario.refreshToken !== refreshToken
      ) {
        throw new AppError(
          "Refresh token inválido",
          401
        );
      }      

      const novoToken =
        gerarAccessToken(usuario);
      return res.json({
        token: novoToken,
      });

    } catch (error) {
      next(error);
    }
  }
}