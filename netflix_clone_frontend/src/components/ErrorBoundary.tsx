import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white p-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-5xl font-bold text-red-600 mb-6">NETFLIX</h1>
            <h2 className="text-2xl font-bold mb-4">Something went wrong.</h2>
            <div className="bg-secondary p-4 rounded mb-6 text-left overflow-auto max-h-48 text-sm text-red-400 border border-red-900/50">
              <code>{this.state.error?.message}</code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
