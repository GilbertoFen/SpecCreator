import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSpecDto } from '../dto/create-spec.dto';
import { SpecApiResponse, SpecListResponse } from '../interfaces/spec-response.interface';
import { SpecService } from '../services/spec.service';

@Controller('api/specs')
export class SpecController {
  constructor(private readonly specService: SpecService) {}

  @Post()
  async createSpec(@Body() dto: CreateSpecDto): Promise<SpecApiResponse> {
    const spec = await this.specService.createSpec(dto.description);

    return { spec };
  }

  @Get()
  async listSpecs(): Promise<SpecListResponse> {
    const specs = await this.specService.listSpecs();

    return { specs };
  }
}
