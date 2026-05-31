'use client';

type SpecComposerFormProps = {
  cooldownLabel?: string | null;
  description: string;
  error: string | null;
  helperText?: string;
  isCooldownActive?: boolean;
  isGenerating: boolean;
  onDescriptionChange: (value: string) => void;
  onGenerate: () => void | Promise<void>;
};

export function SpecComposerForm({
  cooldownLabel = null,
  description,
  error,
  helperText = 'La salida se organizara en seis secciones tecnicas.',
  isCooldownActive = false,
  isGenerating,
  onDescriptionChange,
  onGenerate,
}: SpecComposerFormProps) {
  return (
    <section className="composer-panel">
      <div className="panel-heading">
        <div>
          <p className="workspace-kicker">Entrada</p>
          <h2 className="section-title">Idea o descripcion base</h2>
        </div>
      </div>

      <label className="field-label" htmlFor="description">
        Explica el producto, flujo o problema que quieres convertir en una especificacion
      </label>
      <textarea
        className="spec-textarea"
        id="description"
        name="description"
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder="Ejemplo: Portal interno para registrar requerimientos, aprobarlos por flujo y generar trazabilidad completa por area."
        rows={11}
      />

      <div className="composer-actions">
        <button
          className="primary-button"
          type="button"
          disabled={isGenerating || isCooldownActive || description.trim().length === 0}
          onClick={() => void onGenerate()}
        >
          Generar especificacion
        </button>
        <span className="helper-copy">{cooldownLabel ?? helperText}</span>
      </div>

      {error ? <p className="inline-error">{error}</p> : null}
    </section>
  );
}
