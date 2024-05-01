import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
class FirebaseService {
    handleSeenMessage = async (data, currentUser) => {
        // console.log('call seen',currentUser?.uid);
        // if (currentUser?.uid!==null) {
        //     const rest = await updateDoc(doc(db, 'userChats', currentUser.uid), {
        //         [data.chatId + ".isRead"]: 1,
        //     });
        //     console.log('res',  currentUser.uid);
        // }
    };
}

export default new FirebaseService();
