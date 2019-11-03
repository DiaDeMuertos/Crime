import React, { Component } from 'react';
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  GeoJSON,
  FeatureGroup,
} from 'react-leaflet';
import './Map.css';

const { Overlay } = LayersControl;
const BOSTON_CENTROID = [42.31255208, -71.0778522184999];
const zoom = 11;

class Map extends Component {
  handleGeojsonOnClick = (feature, layer) =>
    layer.on('click', () => {
      const { handlerGetInputsOnClick } = this.props;
      const gridId = layer.defaultOptions.id;
      handlerGetInputsOnClick(gridId);
    });

  render() {
    const { grid, crimesSample } = this.props;

    return (
      <LeafletMap
        center={BOSTON_CENTROID}
        zoom={zoom}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
      >
        <LayersControl position="topright">
          <Overlay name="Centroide" checked>
            <Marker position={BOSTON_CENTROID}>
              <Popup>Centroide</Popup>
            </Marker>
          </Overlay>

          <Overlay name="Grid" checked>
            <FeatureGroup>
              {grid &&
                grid.map(p => (
                  <GeoJSON
                    id={p.id}
                    key={p.id}
                    data={p.geojson}
                    style={{
                      color: 'black',
                      weight: 1,
                      opacity: 0.3,
                      fillColor: 'white',
                    }}
                    onEachFeature={this.handleGeojsonOnClick}
                  />
                ))}
            </FeatureGroup>
          </Overlay>

          <Overlay name="Crimenes">
            <FeatureGroup>
              {crimesSample &&
                crimesSample.map(p => (
                  <GeoJSON
                    id={p.id}
                    key={p.id}
                    data={p.geojson}
                    onEachFeature={this.handleGeojsonOnClick}
                  />
                ))}
            </FeatureGroup>
          </Overlay>
        </LayersControl>
        {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      </LeafletMap>
    );
  }
}

export default Map;
