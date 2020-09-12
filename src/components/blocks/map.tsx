import * as React from 'react'
import { default as MapBox } from 'mapbox-gl'

import { styled } from '../foundations'

declare const MAPBOX_TOKEN: string

interface Props {
  onLoad: (map: MapBox.Map) => void
}

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`

const ACCESS_TOKEN = MAPBOX_TOKEN

const Map = ({ onLoad }: Props) => {
  const mapRef = React.useRef(null)

  React.useEffect(() => {
    // @ts-ignore
    MapBox.accessToken = ACCESS_TOKEN
    const map = new MapBox.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [139.6246545, 35.458983],
      antialias: true,
      zoom: 12,
      pitch: 60,
    })

    map.on('load', () => {
      map.addControl(new MapBox.NavigationControl())
      onLoad(map)
    })
  }, [])

  return <MapContainer id="map" ref={mapRef} />
}

export default Map
