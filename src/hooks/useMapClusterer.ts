import { useEffect, useRef } from 'react';
import { MarkerClusterer, Marker } from '@googlemaps/markerclusterer';

const useMapClusterer = (map: google.maps.Map | null, markers: Marker[]) => {
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map || clusterer.current) return;

    clusterer.current = new MarkerClusterer({ map });

    return () => {
      clusterer.current?.clearMarkers();
    };
  }, [map]);

  useEffect(() => {
    if (clusterer.current) {
      clusterer.current.clearMarkers();
      clusterer.current.addMarkers(markers);
    }
  }, [markers]);

  return clusterer;
};

export default useMapClusterer;
