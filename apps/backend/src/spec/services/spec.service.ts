import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  GeneratedSpec,
  StoredSpecRecord,
} from '../interfaces/spec-response.interface';
import { GeminiSpecService } from './gemini-spec.service';

type SpecRecordModel = Awaited<ReturnType<PrismaClient['spec']['findFirstOrThrow']>>;

@Injectable()
export class SpecService {
  constructor(
    private readonly geminiSpecService: GeminiSpecService,
    private readonly prismaService: PrismaService,
  ) {}

  async createSpec(description: string): Promise<StoredSpecRecord> {
    const generatedSpec = await this.geminiSpecService.generateSpec(description);
    const specDelegate = this.getSpecDelegate();

    const savedSpec = await specDelegate.create({
      data: {
        description,
        vision: this.serializeSection(generatedSpec.vision),
        usuarios: this.serializeSection(generatedSpec.usuarios),
        funcionalidades: this.serializeSection(generatedSpec.funcionalidades),
        flujos: this.serializeSection(generatedSpec.flujos),
        arquitectura: this.serializeSection(generatedSpec.arquitectura),
        requisitos: this.serializeSection(generatedSpec.requisitos),
      },
    });

    return this.toStoredSpecRecord(savedSpec);
  }

  async listSpecs(): Promise<StoredSpecRecord[]> {
    const specDelegate = this.getSpecDelegate();
    const specs = await specDelegate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return specs.map((spec) => this.toStoredSpecRecord(spec));
  }

  async deleteSpec(specId: number): Promise<void> {
    const specDelegate = this.getSpecDelegate();
    const existingSpec = await specDelegate.findUnique({
      where: {
        id: specId,
      },
      select: {
        id: true,
      },
    });

    if (!existingSpec) {
      throw new NotFoundException('La especificacion solicitada no existe.');
    }

    await specDelegate.delete({
      where: {
        id: specId,
      },
    });
  }

  private toStoredSpecRecord(spec: SpecRecordModel): StoredSpecRecord {
    return {
      id: spec.id,
      description: spec.description,
      spec: {
        vision: this.deserializeSection(spec.vision),
        usuarios: this.deserializeSection(spec.usuarios),
        funcionalidades: this.deserializeSection(spec.funcionalidades),
        flujos: this.deserializeSection(spec.flujos),
        arquitectura: this.deserializeSection(spec.arquitectura),
        requisitos: this.deserializeSection(spec.requisitos),
      },
      createdAt: spec.createdAt.toISOString(),
      updatedAt: spec.updatedAt.toISOString(),
    };
  }

  private serializeSection(section: GeneratedSpec['vision']): string {
    return JSON.stringify(section);
  }

  private deserializeSection(rawValue: string): GeneratedSpec['vision'] {
    return JSON.parse(rawValue) as GeneratedSpec['vision'];
  }

  private getSpecDelegate(): PrismaClient['spec'] {
    return (this.prismaService as PrismaClient).spec;
  }
}
