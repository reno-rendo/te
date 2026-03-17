import { AlertCircle, RefreshCw } from "lucide-react";

interface UnifiedErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
  retryLabel?: string;
}

export function UnifiedErrorDisplay({
  message = "Terjadi kesalahan saat memuat data.",
  title = "Gagal Memuat",
  onRetry,
  retryLabel = "Coba Lagi"
}: UnifiedErrorDisplayProps) {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-5 mx-auto max-w-4xl w-full rounded-2xl"
      style={{
        background: 'hsl(var(--card) / 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid hsl(var(--border) / 0.5)'
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: 'hsl(0 84% 60% / 0.1)',
          border: '1px solid hsl(0 84% 60% / 0.25)',
          boxShadow: '0 0 24px hsl(0 84% 60% / 0.12)'
        }}
      >
        <AlertCircle className="w-8 h-8" style={{ color: 'hsl(0 84% 60%)' }} />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-display font-bold text-lg text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200"
          style={{
            background: 'var(--gradient-primary)',
            boxShadow: '0 0 16px hsl(346 77% 62% / 0.35)'
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <RefreshCw className="w-4 h-4" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
}
