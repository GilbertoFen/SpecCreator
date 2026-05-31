type SpecLoadingStateProps = {
  message?: string;
  title?: string;
};

export function SpecLoadingState({
  message = 'Analizando tu descripcion y ordenando la salida en formato tecnico.',
  title = 'Generando especificacion',
}: SpecLoadingStateProps) {
  return (
    <section className="loading-panel" aria-live="polite" aria-busy="true">
      <div className="spinner" />
      <div>
        <h2 className="section-title">{title}</h2>
        <p className="loading-copy">{message}</p>
      </div>
    </section>
  );
}
