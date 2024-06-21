import { collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../api/init-firebase";
import { TMarker } from "../interfaces/TMarker";
import { fromDAOToTMarker } from "../utils/utils";

const upsertQuest = async (point: TMarker, index: number) => {
    await setDoc(doc(db, "quests", `Quest ${index + 1}`), {
        location: `${point.lat}, ${point.lng}`,
        timestamp: new Date().toISOString()
    })
};

const deleteQuest = async (index: number) => {
    await deleteDoc(doc(db, "quests", `Quest ${index + 1}`));
};

const deleteAllQuests = async () => {
    const querySnapshot = await getDocs(collection(db, "quests"));
    const batch = writeBatch(db);
    
    querySnapshot.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });
  
    await batch.commit();
};

const getAllQuests = async () => {
    const querySnapshot = await getDocs(collection(db, "quests"));
    if (querySnapshot.empty) return []
    else {
        const markers: TMarker[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            markers.push(
                fromDAOToTMarker({
                    location: data.location,
                    timestamp: data.timestamp
                })
            )
        });
        return markers;
    }
};

export { deleteAllQuests, deleteQuest, getAllQuests, upsertQuest };

