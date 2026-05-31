'use client';

import { useEffect, useMemo, useState } from 'react';
import { LoginScreen } from '@/components/auth';
import {
  SpecComposerForm,
  SpecHistoryModal,
  SpecLoadingState,
  SpecResults,
} from '@/components/spec';
import { WarningModal } from '@/components/ui';
import { loginWithBackend } from '@/services/auth-service';
import {
  deleteSpecification,
  fetchSpecHistory,
  generateSpecification,
} from '@/services/spec-service';
import { SpecServiceError } from '@/services/spec-service';
import { AuthenticatedUser, StoredSpecRecord } from '@/types/spec';

const GENERATION_COOLDOWN_MS = 60_000;
const STORAGE_THEME_KEY = 'spec-creator-theme';
type ThemeMode = 'light' | 'dark';

function resolveInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem(STORAGE_THEME_KEY);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function SpecWorkspace() {
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<StoredSpecRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<StoredSpecRecord[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(resolveInitialTheme);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const isLoggedIn = Boolean(user);
  const remainingCooldownMs = cooldownEndsAt ? Math.max(cooldownEndsAt - now, 0) : 0;
  const isCooldownActive = remainingCooldownMs > 0;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!isCooldownActive) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const currentTime = Date.now();

      setNow(currentTime);

      if (cooldownEndsAt && currentTime >= cooldownEndsAt) {
        setCooldownEndsAt(null);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [cooldownEndsAt, isCooldownActive]);

  const cooldownLabel = useMemo(() => {
    if (!isCooldownActive) {
      return null;
    }

    const totalSeconds = Math.ceil(remainingCooldownMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `Debes esperar ${minutes}:${String(seconds).padStart(2, '0')} antes de generar otra especificacion.`;
  }, [isCooldownActive, remainingCooldownMs]);

  async function handleLogin(username: string, password: string) {
    if (!username.trim() || !password.trim()) {
      throw new Error('Ingresa usuario y clave para continuar.');
    }

    setIsLoginPending(true);

    try {
      const response = await loginWithBackend({
        password,
        username,
      });

      setUser(response.user);
    } finally {
      setIsLoginPending(false);
    }
  }

  function handleLogout() {
    setCooldownEndsAt(null);
    setDescription('');
    setResult(null);
    setError(null);
    setHistory([]);
    setHistoryError(null);
    setIsHistoryOpen(false);
    setModalMessage(null);
    setPendingDeleteId(null);
    setUser(null);
  }

  function handleToggleTheme() {
    setTheme((currentValue) => (currentValue === 'dark' ? 'light' : 'dark'));
  }

  async function loadHistory() {
    setIsHistoryLoading(true);
    setHistoryError(null);

    try {
      const response = await fetchSpecHistory();
      setHistory(response.specs);
    } catch (historyRequestError) {
      setHistoryError(
        historyRequestError instanceof Error
          ? historyRequestError.message
          : 'No fue posible consultar el historial.',
      );
    } finally {
      setIsHistoryLoading(false);
    }
  }

  async function handleOpenHistory() {
    setIsHistoryOpen(true);

    if (isHistoryLoading) {
      return;
    }

    await loadHistory();
  }

  async function handleDeleteSpec(specId: number) {
    setPendingDeleteId(specId);
    setHistoryError(null);

    try {
      await deleteSpecification(specId);
      setHistory((currentItems) => currentItems.filter((item) => item.id !== specId));

      if (result?.id === specId) {
        setResult(null);
      }
    } catch (deleteError) {
      setHistoryError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No fue posible eliminar la especificacion.',
      );
    } finally {
      setPendingDeleteId(null);
    }
  }

  async function handleGenerate() {
    if (isCooldownActive) {
      setError(cooldownLabel ?? 'Debes esperar antes de generar otra especificacion.');
      return;
    }

    setError(null);
    setResult(null);
    setIsGenerating(true);

    try {
      const data = await generateSpecification(description);
      setResult(data.spec);
      setCooldownEndsAt(Date.now() + GENERATION_COOLDOWN_MS);
      setNow(Date.now());
    } catch (submissionError) {
      if (
        submissionError instanceof SpecServiceError &&
        submissionError.code === 'INVALID_DESCRIPTION'
      ) {
        setModalMessage(
          submissionError.message ||
            'La descripcion enviada no cumple con el formato esperado por el backend.',
        );
      } else {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : 'Ocurrio un error inesperado.',
        );
      }
    } finally {
      setIsGenerating(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="shell">
        <LoginScreen
          description="El formulario valida credenciales reales contra el backend antes de habilitar la consola."
          isSubmitting={isLoginPending}
          onLogin={handleLogin}
          onToggleTheme={handleToggleTheme}
          submitLabel="Iniciar sesion"
          theme={theme}
          title="Ingresa a tu consola de especificaciones"
        />
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="workspace-hero">
        <div>
          <p className="workspace-kicker">Acceso personal</p>
          <h1 className="workspace-title">Spec Creator</h1>
          <p className="workspace-copy">
            Describe una idea y conviertela en una especificacion tecnica estructurada
            para vision, usuarios, funcionalidades, flujos, arquitectura y requisitos.
          </p>
          {user ? (
            <p className="session-indicator">
              Sesion activa: <strong>{user.username}</strong>
            </p>
          ) : null}
        </div>
        <div className="hero-actions">
          <button className="secondary-button" type="button" onClick={() => void handleOpenHistory()}>
            Ver especificaciones realizadas
          </button>
          <button className="secondary-button" type="button" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </div>
      </section>

      <SpecComposerForm
        cooldownLabel={cooldownLabel}
        description={description}
        error={error}
        helperText="La salida se organizara en seis secciones tecnicas."
        isCooldownActive={isCooldownActive}
        isGenerating={isGenerating}
        onDescriptionChange={setDescription}
        onGenerate={handleGenerate}
      />

      {isGenerating ? (
        <SpecLoadingState
          title="Generando especificacion"
          message="Analizando tu descripcion y ordenando la salida en formato tecnico."
        />
      ) : null}

      {result ? <SpecResults description={result.description} spec={result.spec} /> : null}

      <SpecHistoryModal
        error={historyError}
        isLoading={isHistoryLoading}
        isOpen={isHistoryOpen}
        items={history}
        onClose={() => setIsHistoryOpen(false)}
        onDelete={handleDeleteSpec}
        pendingDeleteId={pendingDeleteId}
      />

      <WarningModal
        description="Corrige el contenido de description y vuelve a intentarlo cuando el backend acepte la entrada."
        isOpen={Boolean(modalMessage)}
        onClose={() => setModalMessage(null)}
        title={modalMessage ?? 'La descripcion enviada es invalida.'}
      />
    </main>
  );
}
