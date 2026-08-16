import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Error Boundary global : jamais d'écran blanc. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary', error, info);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-4xl">🛵</p>
          <h1 className="text-xl font-extrabold">Oups, petit accroc</h1>
          <p className="text-sm text-ink-2">
            Une erreur inattendue s'est produite. Vos données sont en sécurité dans le stockage local.
          </p>
          <button
            onClick={() => {
              this.setState({ error: null });
              window.location.href = '/';
            }}
            className="min-h-[44px] rounded-2xl bg-primary px-6 py-2.5 font-semibold text-primary-ink"
          >
            Revenir à l'accueil
          </button>
          <p className="text-xs text-ink-3">{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
