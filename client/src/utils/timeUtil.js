import { Timestamp } from 'firebase/firestore';
import  moment from 'moment';
import 'moment/locale/ja';
moment.locale('ja')
console.log('locale: ' + moment.locale())
export const convertTimeStamp = (time) => {
    const date = new Timestamp(time?.seconds, time?.nanoseconds).toDate();
    return date;
};

export const convertToTimeAgo = (time) => {
    const datetime = new Date(time);

    return moment(datetime).fromNow();
};
