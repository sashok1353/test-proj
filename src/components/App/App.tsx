import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Map, MapMouseEvent, useMap } from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TrashIcon from '../ui/icons/TrashIcon';
import classes from "./App.module.css";
import { Point } from "../../interfaces/Point";

export default function App() {

  const [markers, setMarkers] = useState<Point[]>([]);
  const map = useMap();
  const clusterer = useRef<MarkerClusterer | null>(null);

  const handleAddNewMarker = useCallback((event: MapMouseEvent) => {
    const latLng = event.detail.latLng;
    if (!latLng) return;
    setMarkers(current => [...current, { lat: latLng.lat, lng: latLng.lng, key: uuidv4().toString() }])
  }, []);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  const handleRemoveAllMarkers = () => {
    setMarkers([]);
  };

  const updateMarkerPosition = useCallback((index: number) => (event: google.maps.MapMouseEvent) => {
    const newPos = event.latLng;
    if (!newPos) return;
    const { lat, lng } = newPos;
    setMarkers(prev => {
      const updatedMarkers = [...prev]
      updatedMarkers[index] = {
        ...updatedMarkers[index],
        lat: lat(),
        lng: lng()
      };
      return updatedMarkers;
    });
  }, []);

  const removeMarker = useCallback((index: number) => {
    setMarkers((current) => current.filter((_, i) => i !== index));
  }, []);

  const getPingGlyph = (index: number) => {
    return new google.maps.marker.PinElement({
      glyph: (index + 1).toString(),
      glyphColor: 'white',
    });
  }

  const createDraggableMarker = useCallback((marker: Point, index: number) => {
    const draggableMarker = new google.maps.marker.AdvancedMarkerElement({
      gmpDraggable: true,
      gmpClickable: true,
      content: getPingGlyph(index).element,
      position: {
        lat: marker.lat,
        lng: marker.lng
      },
    })
    draggableMarker.addListener('dragend', updateMarkerPosition(index));
    draggableMarker.addListener('click', () => {
      removeMarker(index);
    });
    return draggableMarker;
  }, [removeMarker, updateMarkerPosition])

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers).map((marker, index) => createDraggableMarker(marker, index)));
  }, [createDraggableMarker, markers, removeMarker, updateMarkerPosition]);

  return (
    <>
      <Map
        style={{ width: '100vw', height: '100vh' }}
        defaultCenter={{ lat: 37.42, lng: -122.1 }}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={import.meta.env.VITE_MAP_ID}
        onClick={handleAddNewMarker}
      />
      <div className={classes.trashIcon} onClick={handleRemoveAllMarkers}>
        <TrashIcon />
      </div>
    </>
  );
}
