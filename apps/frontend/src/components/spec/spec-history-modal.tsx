'use client';

import { SpecExportActions } from '@/components/spec/spec-export-actions';
import { SpecSectionsView } from '@/components/spec/spec-sections-view';
import { StoredSpecRecord } from '@/types/spec';

type SpecHistoryModalProps = {
  error: string | null;
  isLoading: boolean;
  isOpen: boolean;
  items: StoredSpecRecord[];
  onClose: () => void;
};

function formatDate(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
}

export function SpecHistoryModal({
  error,
  isLoading,
  isOpen,
  items,
  onClose,
}: SpecHistoryModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div aria-modal="true" className="history-modal-overlay" role="dialog">
      <div className="history-modal-panel">
        <div className="history-modal-header">
          <div>
            <p className="workspace-kicker">Historial</p>
            <h2 className="modal-title">Especificaciones realizadas</h2>
            <p className="modal-copy">
              Revisa, copia o exporta especificaciones previas sin salir del workspace.
            </p>
          </div>
          <button className="secondary-button" onClick={onClose} type="button">
            Cerrar historial
          </button>
        </div>

        {isLoading ? <p className="history-status">Cargando historial de especificaciones...</p> : null}
        {error ? <p className="inline-error">{error}</p> : null}
        {!isLoading && !error && items.length === 0 ? (
          <p className="history-status">No hay especificaciones registradas todavia.</p>
        ) : null}

        <div className="history-grid">
          {items.map((item, index) => (
            <article className="history-entry" key={item.id}>
              <div className="history-entry-header">
                <div>
                  <span className="result-chip">Spec #{index + 1}</span>
                  <h3 className="history-entry-title">{item.spec.vision.title}</h3>
                </div>
                {formatDate(item.createdAt) ? <span className="history-entry-date">{formatDate(item.createdAt)}</span> : null}
              </div>

              <div className="history-description">
                <p className="field-label">Descripcion original</p>
                <p className="history-description-copy">{item.description}</p>
              </div>

              <SpecSectionsView spec={item.spec} />
              <SpecExportActions
                description={item.description}
                fileBaseName={item.description}
                spec={item.spec}
              />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
