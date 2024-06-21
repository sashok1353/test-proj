import { Map, useMap } from '@vis.gl/react-google-maps';
import useMapClusterer from "../../hooks/useMapClusterer";
import useMarkers from "../../hooks/useMarkers";
import { TMarker } from "../../interfaces/TMarker";
import { createDraggableMarker } from "../../utils/utils";
import TrashIcon from '../ui/icons/TrashIcon';
import classes from "./App.module.css";

export default function App() {

  const { markers, updateMarker, removeAllMarkers, removeMarker, addMarker } = useMarkers();
  const map = useMap();
  useMapClusterer(map, markers.map((marker: TMarker, index) =>
    createDraggableMarker(marker, index, updateMarker, removeMarker)
  ));

  return (
    <>
      <Map
        style={{ width: '100vw', height: '100vh' }}
        defaultCenter={{ lat: 37.42, lng: -122.1 }}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={import.meta.env.VITE_MAP_ID}
        onClick={addMarker}
      />
      <div className={classes.trashIcon} onClick={removeAllMarkers}>
        <TrashIcon />
      </div>
    </>
  );
}
