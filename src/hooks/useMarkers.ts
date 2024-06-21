import { MapMouseEvent } from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { TMarker } from "../interfaces/TMarker";
import { deleteAllQuests, deleteQuest, getAllQuests, upsertQuest } from "../services/questservice";

const useMarkers = () => {
    const [markers, setMarkers] = useState<TMarker[]>([]);

    useEffect(() => {
        getAllQuests().then((data: TMarker[]) => {
            setMarkers(data)
        })
    }, []);

    const addMarker = useCallback((event: MapMouseEvent) => {
        const latLng = event.detail.latLng;
        if (!latLng) return;
        const newPoint = { lat: latLng.lat, lng: latLng.lng, key: uuidv4().toString() };
        upsertQuest(newPoint, markers.length).then(() => {
            setMarkers(current => [...current, newPoint]);
        });
    }, [markers.length]);

    const removeAllMarkers = useCallback(() => {
        deleteAllQuests().then(() => {
            setMarkers([]);
        });
    }, []);

    const updateMarker = useCallback((index: number) => (event: google.maps.MapMouseEvent) => {
        const newPos = event.latLng;
        if (!newPos) return;
        const { lat, lng } = newPos;
        if (markers[index] && markers[index]?.key) {
            const newPoint = { key: markers[index]?.key ?? uuidv4(), lat: lat(), lng: lng() };
            upsertQuest(newPoint, index).then(() => {
                setMarkers(prev => {
                    const updatedMarkers = [...prev];
                    updatedMarkers[index] = newPoint;
                    return updatedMarkers;
                });
            });
        }
    }, [markers]);

    const removeMarker = useCallback((index: number) => {
        deleteQuest(index).then(() => {
            setMarkers(current => current.filter((_, i) => i !== index));
        });
    }, []);


    return {
        markers,
        addMarker,
        removeAllMarkers,
        removeMarker,
        updateMarker
    };
};

export default useMarkers;