import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { ConvexReactClient } from 'convex/react'
import { MacalyBridge } from '@macaly/bridge'
import '../styles.css'
import siteMetadata from '../metadata.json'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)
const rootMeta = siteMetadata['/']

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: rootMeta.title },
      { name: 'description', content: rootMeta.description },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head><HeadContent /></head>
      <MacalyBridge>
        <body>
          <ConvexAuthProvider client={convex}>
            {children}
          </ConvexAuthProvider>
          <Scripts />
        </body>
      </MacalyBridge>
    </html>
  )
}
