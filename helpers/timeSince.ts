import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(localeData);
dayjs.extend(updateLocale);
dayjs.extend(relativeTime);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: '1m',
    mm: '%dm',
    h: '%d hour',
    hh: '%dh',
    d: '%d day',
    dd: '%d days',
    M: '%d month',
    MM: '%d months',
    y: '%d year',
    yy: '%d years',
  },
});

declare module 'dayjs' {
  export function timeSince(date: dayjs.ConfigType): string;
}

export const dayjsTimeSince: dayjs.PluginFunc = (_options, _dayjsClass, dayjsFactory) =>
  (dayjsFactory.timeSince = (date: dayjs.ConfigType) => dayjs(date).fromNow());
