import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

const getTime = (time) => dayjs(time).format('HH:mm');

const getLastSeen = (time, explicit = false) => explicit ?
    (dayjs(time).isToday() ?
        ('today at ' + getTime(time)) :
        dayjs(time).isYesterday() ?
            ('yesterday at ' + getTime(time)) :
            dayjs(time).format('DD-MM-YYYY')) :
    dayjs(time).fromNow();


export { getTime, getLastSeen };