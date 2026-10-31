import { useEffect } from 'react'

// Keeps the tab title in step with the route. The prerendered HTML for each route already has
// the same title (see src/prerender.ts), so this only matters after client-side navigation.
export function useDocumentTitle (title: string): void {
  useEffect(() => {
    document.title = title
  }, [title])
}
