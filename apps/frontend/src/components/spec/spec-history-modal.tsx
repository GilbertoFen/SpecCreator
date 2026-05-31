'use client';

import { useState } from 'react';
import { SpecExportActions } from '@/components/spec/spec-export-actions';
import { SpecSectionsView } from '@/components/spec/spec-sections-view';
import { StoredSpecRecord } from '@/types/spec';

type SpecHistoryModalProps = {
  error: string | null;
  isLoading: boolean;
  isOpen: boolean;
  items: StoredSpecRecord[];
  onClose: () => void;
  onDelete: (specId: number) => void | Promise<void>;
  pendingDeleteId: number | null;
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
  onDelete,
  pendingDeleteId,
}: SpecHistoryModalProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!isOpen) {
    return null;
  }

  function toggleExpanded(specId: number) {
    setExpandedId((currentValue) => (currentValue === specId ? null : specId));
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
                <button
                  aria-expanded={expandedId === item.id}
                  className="history-entry-toggle"
                  onClick={() => toggleExpanded(item.id)}
                  type="button"
                >
                  <div>
                    <span className="result-chip">Spec #{index + 1}</span>
                    <h3 className="history-entry-title">{item.spec.vision.title}</h3>
                    <p className="history-entry-summary">
                      {expandedId === item.id
                        ? 'Ocultar especificacion completa'
                        : 'Mostrar especificacion completa'}
                    </p>
                  </div>
                  <div className="history-entry-meta">
                    {formatDate(item.createdAt) ? (
                      <span className="history-entry-date">{formatDate(item.createdAt)}</span>
                    ) : null}
                    <span className="history-entry-caret" aria-hidden="true">
                      {expandedId === item.id ? '−' : '+'}
                    </span>
                  </div>
                </button>
                <button
                  className="secondary-button danger-button"
                  disabled={pendingDeleteId === item.id}
                  onClick={() => void onDelete(item.id)}
                  type="button"
                >
                  {pendingDeleteId === item.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>

              {expandedId === item.id ? (
                <div className="history-entry-body">
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
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
