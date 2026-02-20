import { StrictMode, Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#F8FAFC', fontFamily: 'Inter, sans-serif', background: '#0B0E14', minHeight: '100vh' }}>
          <h1 style={{ color: '#EF4444', fontSize: '24px', marginBottom: '16px' }}>
            ⚠️ Application Error
          </h1>
          <p style={{ color: '#94A3B8', marginBottom: '12px' }}>
            Something went wrong while loading the application.
          </p>
          <pre style={{ background: '#1E293B', padding: '16px', borderRadius: '8px', overflow: 'auto', fontSize: '14px', color: '#F87171' }}>
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
