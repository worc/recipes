import React from 'react'
import { createRoot } from 'react-dom/client'
import { Router, Switch, Route, Link } from 'wouter'
import { createGlobalStyle } from 'styled-components'

// self-hosted fonts: esbuild copies the woff2/woff files into /public/ with content hashes
import '@fontsource/rokkitt/400.css'
import '@fontsource/rokkitt/700.css'
import '@fontsource/cascadia-code/400.css'
import '@fontsource/cascadia-code/700.css'

import { PAGES } from './pages'
import { NOT_FOUND_TITLE } from './meta'
import { useDocumentTitle } from './document_title'
import Layout from './layout'
import Home from './home'
import Page from './page'
import { COLOR, FONT } from './theme'

// The GitHub Pages era used HashRouter (/#/frybread). Keep those links working by
// moving the hash path into the real path before the router reads the location.
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1))
}
// Pages that moved. Old links (bookmarks, chats) land on the new address instead of the 404.
const MOVED: Record<string, string> = {
  // 2026-10-31: the recipe was a copy of someone else's; the page is now a notebook for our own version
  '/acorn-squash': '/notebooks/acorn-squash',
}
const moved = MOVED[window.location.pathname.replace(/\/+$/, '')]
if (moved !== undefined) {
  window.history.replaceState(null, '', moved)
}

// Routes have no trailing slash. /frybread/ reaches the same prerendered file on the server
// (and an nginx `$uri/` rule would 301 to it), so fold it back before routing.
if (window.location.pathname.length > 1 && window.location.pathname.endsWith('/')) {
  window.history.replaceState(null, '', window.location.pathname.replace(/\/+$/, '') + window.location.search + window.location.hash)
}

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }

  html {
    font-size: 17px;
    -webkit-text-size-adjust: 100%;
    color-scheme: light;
  }

  body {
    margin: 0;
    background: ${COLOR.paper};
    color: ${COLOR.ink};
    font-family: ${FONT.body};
    line-height: 1.55;
  }

  a {
    color: ${COLOR.turquoiseInk};
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }
  a:hover { background: ${COLOR.hazeFaint}; }
  a:focus-visible {
    outline: 2px solid ${COLOR.turquoiseInk};
    outline-offset: 2px;
  }

  ::selection { background: ${COLOR.haze}; }

  @media print {
    html { font-size: 12pt; }
    [data-noprint] { display: none !important; }
    a { color: inherit; text-decoration: none; }
  }
`

function NotFound () {
  useDocumentTitle(NOT_FOUND_TITLE)
  return (
    <>
      <h1>nothing here</h1>
      <p>No recipe or notebook at this address. The <Link href='/'>index</Link> has everything there is.</p>
    </>
  )
}

createRoot(document.getElementById('app')!).render(
  <Router>
    <GlobalStyle/>
    <Layout>
      <Switch>
        <Route path='/'><Home/></Route>
        { PAGES.map(entry => (
          <Route key={entry.path} path={entry.path}><Page entry={entry}/></Route>
        )) }
        <Route><NotFound/></Route>
      </Switch>
    </Layout>
  </Router>
)
