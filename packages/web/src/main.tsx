import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Routes from './route'
import { AppStoreProvider } from '@monorepo/ui-components/src/state/index'
import { ErrorBoundary } from 'react-error-boundary'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <AppStoreProvider>
        <Routes></Routes>
      </AppStoreProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
