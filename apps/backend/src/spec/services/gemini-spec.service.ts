import {
  BadRequestException,
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import {
  GeneratedSpec,
  GeminiSpecResult,
  RejectedSpecResponse,
} from '../interfaces/spec-response.interface';

type SchemaObject = Record<string, unknown>;
const INVALID_SPEC_MESSAGE = 'peticion invalida, solo puedo devolver especificaciones';

@Injectable()
export class GeminiSpecService {
  private readonly model: string;
  private readonly client: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'La variable GEMINI_API_KEY no esta configurada en el backend.',
      );
    }

    this.model = this.configService.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash-lite';
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateSpec(description: string): Promise<GeneratedSpec> {
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: description,
        config: {
          systemInstruction: this.buildSystemPrompt(),
          responseMimeType: 'application/json',
          responseJsonSchema: this.buildSchema(),
          temperature: 0.4,
        },
      });

      const rawText = response.text;

      if (!rawText) {
        throw new BadGatewayException(
          'Gemini no devolvio contenido util para generar la especificacion.',
        );
      }

      const parsedResponse = JSON.parse(rawText) as GeminiSpecResult;

      if (this.isRejectedResponse(parsedResponse)) {
        throw new BadRequestException(INVALID_SPEC_MESSAGE);
      }

      return parsedResponse.spec;
    } catch (error) {
      if (error instanceof BadGatewayException || error instanceof BadRequestException) {
        throw error;
      }

      const message = error instanceof Error ? error.message : 'Error desconocido del SDK.';

      throw new BadGatewayException(
        `No fue posible generar la especificacion con Gemini: ${message}`,
      );
    }
  }

  private buildSystemPrompt(): string {
    return [
      'Eres un analista de producto y arquitecto de software senior.',
      '',
      'Convierte la descripcion recibida en una especificacion tecnica clara y accionable.',
      'Responde unicamente en JSON valido respetando el esquema proporcionado.',
      `Si la peticion no trata sobre especificaciones de aplicaciones, sistemas, software o productos digitales, debes rechazarla con el mensaje exacto "${INVALID_SPEC_MESSAGE}".`,
      'Tambien debes rechazar peticiones de matematicas, programacion general, busquedas web, trivia, redaccion libre, traducciones o cualquier cosa fuera del alcance de especificaciones.',
      'Cada seccion debe tener un titulo breve y una lista de puntos concretos.',
      'Si la peticion es valida, las seis secciones obligatorias son: vision, usuarios, funcionalidades, flujos, arquitectura y requisitos.',
      'No incluyas markdown, explicaciones extra, ni texto fuera del JSON.',
    ].join(' ');
  }

  private buildSchema(): SchemaObject {
    const sectionSchema = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Titulo corto de la seccion.',
        },
        content: {
          type: 'array',
          description: 'Lista de puntos tecnicos claros y accionables.',
          items: {
            type: 'string',
          },
          minItems: 2,
        },
      },
      required: ['title', 'content'],
      additionalProperties: false,
    };

    return {
      type: 'object',
      properties: {
        rejected: {
          type: 'boolean',
        },
        message: {
          type: 'string',
        },
        spec: {
          type: 'object',
          properties: {
            vision: sectionSchema,
            usuarios: sectionSchema,
            funcionalidades: sectionSchema,
            flujos: sectionSchema,
            arquitectura: sectionSchema,
            requisitos: sectionSchema,
          },
          required: [
            'vision',
            'usuarios',
            'funcionalidades',
            'flujos',
            'arquitectura',
            'requisitos',
          ],
          additionalProperties: false,
        },
      },
      required: ['rejected'],
      additionalProperties: false,
      oneOf: [
        {
          properties: {
            rejected: {
              const: false,
            },
          },
          required: ['rejected', 'spec'],
        },
        {
          properties: {
            rejected: {
              const: true,
            },
            message: {
              const: INVALID_SPEC_MESSAGE,
            },
          },
          required: ['rejected', 'message'],
        },
      ],
    };
  }

  private isRejectedResponse(payload: GeminiSpecResult): payload is RejectedSpecResponse {
    return payload.rejected === true;
  }
}
