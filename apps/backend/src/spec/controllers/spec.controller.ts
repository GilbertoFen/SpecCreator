import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CreateSpecDto } from '../dto/create-spec.dto';
import { DeleteSpecParamsDto } from '../dto/delete-spec-params.dto';
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSpec(@Param() params: DeleteSpecParamsDto): Promise<void> {
    await this.specService.deleteSpec(params.id);
  }
}
