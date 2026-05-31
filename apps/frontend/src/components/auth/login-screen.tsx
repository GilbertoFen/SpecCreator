'use client';

import { FormEvent, useState } from 'react';

function SunIcon() {
  return (
    <svg aria-hidden="true" className="theme-toggle-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.75v2.1M12 19.15v2.1M4.93 4.93l1.49 1.49M17.58 17.58l1.49 1.49M2.75 12h2.1M19.15 12h2.1M4.93 19.07l1.49-1.49M17.58 6.42l1.49-1.49"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="theme-toggle-icon" viewBox="0 0 24 24">
      <path
        d="M18.2 14.81A7.45 7.45 0 0 1 9.2 5.8a7.74 7.74 0 1 0 9 9.01Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

type LoginScreenProps = {
  description?: string;
  isSubmitting?: boolean;
  onLogin: (username: string, password: string) => void | Promise<void>;
  onToggleTheme: () => void;
  submitLabel?: string;
  theme: 'light' | 'dark';
  title?: string;
};

export function LoginScreen({
  description = 'Este acceso es simulado y local. Solo habilita la entrada a la herramienta antes de mostrar la consola personal.',
  isSubmitting = false,
  onLogin,
  onToggleTheme,
  submitLabel = 'Iniciar sesion',
  theme,
  title = 'Ingresa a tu consola de especificaciones',
}: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await onLogin(username, password);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'No fue posible iniciar sesion.',
      );
    }
  }

  return (
    <section className="login-stage">
      <div className="login-panel">
        <div className="login-panel-header">
          <p className="workspace-kicker">Sesion privada</p>
          <button
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-pressed={theme === 'dark'}
            className="theme-toggle"
            onClick={onToggleTheme}
            type="button"
          >
            <span className="theme-toggle-track">
              <span className="theme-toggle-slot">
                <SunIcon />
              </span>
              <span className="theme-toggle-slot">
                <MoonIcon />
              </span>
              <span className="theme-toggle-thumb" />
            </span>
          </button>
        </div>
        <h1 className="login-title">{title}</h1>
        <p className="login-copy">{description}</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="username">
            Usuario
          </label>
          <input
            className="text-input"
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="tu-usuario"
            type="text"
            disabled={isSubmitting}
          />

          <label className="field-label" htmlFor="password">
            Clave
          </label>
          <input
            className="text-input"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            type="password"
            disabled={isSubmitting}
          />

          {error ? <p className="inline-error">{error}</p> : null}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Validando acceso...' : submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
}
