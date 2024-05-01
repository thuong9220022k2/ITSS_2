// import { db } from '../../firebase';
// import { addDoc, doc, serverTimestamp } from 'firebase/firestore';
import { message } from 'antd';
class Http {
    static post = async (url, data) => {
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: 'Bearer ' + localStorage.getItem('@token'),
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response?.message) message.open({ type: 'success', content: response.message });
                console.log(response);
                return response.data;
            });
    };
    static put = async (url, data) => {
        return await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: 'Bearer ' + localStorage.getItem('@token'),
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response?.message) message.open({ type: 'success', content: response.message });
                return response.data;
            });
    };

    static get = async (url) => {
        return await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: 'Bearer ' + localStorage.getItem('@token'),
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response?.message) message.open({ type: 'success', content: response.message });
                return response.data;
            });
    };

    static delete = async (url) => {
        return await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: 'Bearer ' + localStorage.getItem('@token'),
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response?.message) message.open({ type: 'success', content: response.message });
                return response.data;
            });
    };
}

export default Http;
