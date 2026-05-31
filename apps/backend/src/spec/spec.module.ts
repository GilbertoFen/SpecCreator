import { Module } from '@nestjs/common';
import { SpecController } from './controllers/spec.controller';
import { GeminiSpecService } from './services/gemini-spec.service';
import { SpecService } from './services/spec.service';

@Module({
  controllers: [SpecController],
  providers: [GeminiSpecService, SpecService],
})
export class SpecModule {}
