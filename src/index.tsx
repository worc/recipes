import React from 'react'
import { createRoot } from 'react-dom/client'
import { Router, Link, Switch, Route } from 'wouter'
import styled, { createGlobalStyle } from 'styled-components'

import { RECIPES } from './recipes'
import Recipe from './recipe'

// The GitHub Pages era used HashRouter (/#/frybread). Keep those links working by
// moving the hash path into the real path before the router reads the location.
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1))
}

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`

const Navigation = styled.nav`
  display: flex;
  flex-flow: row wrap;
  gap: 8px;
  margin-bottom: 16px;
`

function Home () {
  return (
    <>
      <h1>recipes</h1>
      <ul>
        { RECIPES.map(({ slug, name }) => (
          <li key={slug}><Link href={`/${slug}`}>{name}</Link></li>
        )) }
      </ul>
    </>
  )
}

createRoot(document.getElementById('app')!).render(
  <Router>
    <GlobalStyle/>
    <Navigation>
      <Link href='/'>Home</Link>
      { RECIPES.map(({ slug, name }) => <Link key={slug} href={`/${slug}`}>{name}</Link>) }
    </Navigation>
    <main>
      <Switch>
        <Route path='/' component={Home}/>
        { RECIPES.map(({ slug, markdown }) => (
          <Route key={slug} path={`/${slug}`}><Recipe url={markdown}/></Route>
        )) }
        <Route><h2>404</h2></Route>
      </Switch>
    </main>
  </Router>
)
