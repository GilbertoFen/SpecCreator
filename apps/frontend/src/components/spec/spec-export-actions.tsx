'use client';

import { useState } from 'react';
import { downloadSpecAsPdf } from '@/services/pdf-service';
import { convertSpecToMarkdown } from '@/services/spec-service';
import { GeneratedSpec } from '@/types/spec';

type SpecExportActionsProps = {
  description?: string;
  fileBaseName?: string;
  spec: GeneratedSpec;
};

type ActionState = 'idle' | 'json' | 'markdown' | 'md-file' | 'pdf-file' | 'error';

function sanitizeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'specification';
}

export function SpecExportActions({
  description,
  fileBaseName = 'specification',
  spec,
}: SpecExportActionsProps) {
  const [actionState, setActionState] = useState<ActionState>('idle');

  function scheduleReset() {
    window.setTimeout(() => setActionState('idle'), 1800);
  }

  async function handleCopyJson() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(spec, null, 2));
      setActionState('json');
    } catch {
      setActionState('error');
    }

    scheduleReset();
  }

  async function handleCopyMarkdown() {
    try {
      await navigator.clipboard.writeText(convertSpecToMarkdown(spec, description));
      setActionState('markdown');
    } catch {
      setActionState('error');
    }

    scheduleReset();
  }

  function handleDownloadMarkdown() {
    const markdown = convertSpecToMarkdown(spec, description);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = sanitizeFileName(fileBaseName);

    link.href = url;
    link.download = `${safeName}.md`;
    link.click();
    window.URL.revokeObjectURL(url);
    setActionState('md-file');
    scheduleReset();
  }

  function handleDownloadPdf() {
    const safeName = sanitizeFileName(fileBaseName);
    downloadSpecAsPdf(`${safeName}.pdf`, safeName, spec, description);
    setActionState('pdf-file');
    scheduleReset();
  }

  function getActionLabel() {
    switch (actionState) {
      case 'json':
        return 'JSON copiado';
      case 'markdown':
        return 'Markdown copiado';
      case 'md-file':
        return 'Markdown descargado';
      case 'pdf-file':
        return 'PDF descargado';
      case 'error':
        return 'No se pudo completar la accion';
      default:
        return null;
    }
  }

  return (
    <div className="copy-actions">
      {getActionLabel() ? <span className="helper-copy">{getActionLabel()}</span> : null}
      <button className="secondary-button" type="button" onClick={handleCopyMarkdown}>
        Copiar en Markdown
      </button>
      <button className="secondary-button" type="button" onClick={handleDownloadMarkdown}>
        Descargar .md
      </button>
      <button className="secondary-button" type="button" onClick={handleDownloadPdf}>
        Descargar PDF
      </button>
      <button className="secondary-button" type="button" onClick={handleCopyJson}>
        Copiar especificacion en JSON
      </button>
    </div>
  );
}
