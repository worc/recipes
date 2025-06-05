import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'

import AcornSquash from './recipes/acorn-squash'
import Coddle from './recipes/coddle'
import FrenchToast from './recipes/french-toast'
import Frybread from './recipes/frybread'
import TomKhaGai from './recipes/tom-kha-gai'
import PieDough from './recipes/pie-dough'

const Navigation = styled.nav`
  display: flex;
  flex-flow: row nowrap;
  gap: 8px;
  margin-bottom: 16px;
`
export default function App () {

  return (
    <>
      <Navigation>
        <Link to="/">Home</Link>
        <Link to="acorn-squash">Acorn Squash</Link>
        <Link to="/coddle">Coddle</Link>
        <Link to="/french-toast">French Toast</Link>
        <Link to="/frybread">Frybread</Link>
        <Link to="/tom-kha-gai">Tom Kha Gai</Link>
        <Link to="/pie-dough">Pie Dough</Link>
      </Navigation>
      <div>
        <Routes>
          <Route path="/acorn-squash" element=<AcornSquash/> />
          <Route path="/coddle" element=<Coddle/> />
          <Route path="/french-toast" element=<FrenchToast/> />
          <Route path="/frybread" element=<Frybread/> />
          <Route path="/tom-kha-gai" element=<TomKhaGai/> />
          <Route path="/pie-dough" element=<PieDough/> />
        </Routes>
      </div>
    </>
  )
}
