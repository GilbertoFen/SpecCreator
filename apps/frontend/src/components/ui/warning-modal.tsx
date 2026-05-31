'use client';

type WarningModalProps = {
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export function WarningModal({
  description,
  isOpen,
  onClose,
  title,
}: WarningModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-labelledby="warning-modal-title"
      aria-modal="true"
      className="modal-overlay"
      role="dialog"
    >
      <div className="modal-panel">
        <p className="workspace-kicker">Advertencia</p>
        <h2 className="modal-title" id="warning-modal-title">
          {title}
        </h2>
        {description ? <p className="modal-copy">{description}</p> : null}
        <div className="modal-actions">
          <button className="primary-button" onClick={onClose} type="button">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
