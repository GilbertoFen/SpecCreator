export interface SpecSection {
  title: string;
  content: string[];
}

export interface GeneratedSpec {
  vision: SpecSection;
  usuarios: SpecSection;
  funcionalidades: SpecSection;
  flujos: SpecSection;
  arquitectura: SpecSection;
  requisitos: SpecSection;
}

export interface StoredSpecRecord {
  id: number;
  description: string;
  spec: GeneratedSpec;
  createdAt: string;
  updatedAt: string;
}

export interface SpecApiResponse {
  spec: StoredSpecRecord;
}

export interface SpecListResponse {
  specs: StoredSpecRecord[];
}

export interface RejectedSpecResponse {
  rejected: true;
  message: string;
}

export interface GeneratedSpecPayload {
  rejected: false;
  spec: GeneratedSpec;
}

export type GeminiSpecResult = GeneratedSpecPayload | RejectedSpecResponse;
