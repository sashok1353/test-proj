import { MarkerDAO } from "../interfaces/MarkerDAO";
import { TMarker } from "../interfaces/TMarker";
import { v4 as uuidv4 } from 'uuid';
export const getPingGlyph = (index: number) => {
    return new google.maps.marker.PinElement({
        glyph: (index + 1).toString(),
        glyphColor: 'white',
    });
};

export const createDraggableMarker = (marker: TMarker, index: number, updateMarker: (index: number) => (event: google.maps.MapMouseEvent) => void, removeMarker: (index: number) => void) => {
    const draggableMarker = new google.maps.marker.AdvancedMarkerElement({
        gmpDraggable: true,
        gmpClickable: true,
        content: getPingGlyph(index).element,
        position: {
            lat: marker.lat,
            lng: marker.lng
        },
    });
    draggableMarker.addListener('dragend', updateMarker(index));
    draggableMarker.addListener('click', () => {
        removeMarker(index);
    });
    return draggableMarker;
};

export const fromDAOToTMarker = (markerDAO: MarkerDAO): TMarker => {
    const [lat, lng] = markerDAO.location.split(",");
    try {
        return {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            key: uuidv4()
        }
    } catch {
        return {
            lat: 12.0,
            lng: 12.0,
            key: uuidv4()
        }
    }
    
}