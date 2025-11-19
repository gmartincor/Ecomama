'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl mb-4">📡</div>
        <h1 className="text-3xl font-bold text-foreground">
          Sin conexión
        </h1>
        <p className="text-muted-foreground text-lg">
          No tienes conexión a internet. Por favor, verifica tu conexión e intenta de nuevo.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
