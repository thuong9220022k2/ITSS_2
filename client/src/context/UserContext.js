import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [listUser, setListUser] = useState({});

    useEffect(() => {
        const q = query(collection(db, 'users'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let users = [];
            let objectUsers={}
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            users=users?.map((user) =>{
                objectUsers[user.uid]=user;
            })
            setListUser(objectUsers)
            console.log('[list user]', objectUsers);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return <UserContext.Provider value={{ listUser }}>{children}</UserContext.Provider>;
};
