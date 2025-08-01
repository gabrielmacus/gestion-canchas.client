import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import App from './App.tsx'
import { AppProviders } from './sections/SharedKernel/Providers/AppProviders'
import { Notifications } from '@mantine/notifications'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <Notifications />
      <App />
    </AppProviders>
  </StrictMode>,
)
