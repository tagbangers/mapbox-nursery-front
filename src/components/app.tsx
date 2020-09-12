import * as React from 'react'
import { Map as MapInstance } from 'mapbox-gl'

import { theme, ThemeProvider, GlobalStyle } from './foundations'
import { Map } from './blocks'

const App = () => {
  const [map, setMap] = React.useState<MapInstance>()

  const handleMapLoaded = (mapInstance: MapInstance) => {
    setMap(mapInstance)
  }

  console.log(map)

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Map onLoad={handleMapLoaded} />
    </ThemeProvider>
  )
}

export default App
