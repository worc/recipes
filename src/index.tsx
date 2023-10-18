import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter} from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'

import App from './App'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`

const container = document.getElementById('app')

const root = createRoot(container)

root.render(
  <>
    <GlobalStyle/>
    <HashRouter>
      <App/>
    </HashRouter>
  </>
)
