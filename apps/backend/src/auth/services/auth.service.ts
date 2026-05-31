import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthSuccessResponse, AuthUserResponse } from '../interfaces/auth-response.interface';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(input: RegisterInput): Promise<AuthSuccessResponse> {
    const username = input.username.trim();
    const existingUser = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new BadRequestException('El username ya esta registrado.');
    }

    const passwordHash = await this.hashPassword(input.password);

    let user: User;

    try {
      user = await this.prismaService.user.create({
        data: {
          username,
          passwordHash,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('El username ya esta registrado.');
      }

      throw error;
    }

    return {
      message: 'Usuario registrado correctamente.',
      user: this.toAuthUserResponse(user),
    };
  }

  async login(input: LoginInput): Promise<AuthSuccessResponse> {
    const username = input.username.trim();
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
      },
    });

    return {
      message: 'Login correcto.',
      user: this.toAuthUserResponse(updatedUser),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 12);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al hashear.';
      throw new InternalServerErrorException(
        `No fue posible procesar la contrasena del usuario: ${message}`,
      );
    }
  }

  private toAuthUserResponse(user: User): AuthUserResponse {
    return {
      id: user.id,
      username: user.username,
      registeredAt: user.registeredAt.toISOString(),
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
    };
  }
}
