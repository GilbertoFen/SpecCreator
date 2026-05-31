import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe';
import { AuthSuccessResponse } from '../interfaces/auth-response.interface';
import {
  LoginInput,
  RegisterInput,
  loginSchema,
  registerSchema,
} from '../schemas/auth.schema';
import { AuthService } from '../services/auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: RegisterInput,
  ): Promise<AuthSuccessResponse> {
    return this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginInput,
  ): Promise<AuthSuccessResponse> {
    return this.authService.login(body);
  }
}
