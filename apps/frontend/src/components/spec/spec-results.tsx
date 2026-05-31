'use client';

import { SpecExportActions } from '@/components/spec/spec-export-actions';
import { SpecSectionsView } from '@/components/spec/spec-sections-view';
import { GeneratedSpec } from '@/types/spec';

type SpecResultsProps = {
  description?: string;
  spec: GeneratedSpec;
};

export function SpecResults({ description, spec }: SpecResultsProps) {
  return (
    <section className="results-panel">
      <div className="panel-heading">
        <div>
          <p className="workspace-kicker">Salida</p>
          <h2 className="section-title">Especificacion estructurada</h2>
        </div>
      </div>

      <SpecSectionsView spec={spec} />
      <SpecExportActions description={description} spec={spec} />
    </section>
  );
}
