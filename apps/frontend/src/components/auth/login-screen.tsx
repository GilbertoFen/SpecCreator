'use client';

import { FormEvent, useState } from 'react';

type LoginScreenProps = {
  description?: string;
  isSubmitting?: boolean;
  onLogin: (username: string, password: string) => void | Promise<void>;
  submitLabel?: string;
  title?: string;
};

export function LoginScreen({
  description = 'Este acceso es simulado y local. Solo habilita la entrada a la herramienta antes de mostrar la consola personal.',
  isSubmitting = false,
  onLogin,
  submitLabel = 'Iniciar sesion',
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
        <p className="workspace-kicker">Sesion privada</p>
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
