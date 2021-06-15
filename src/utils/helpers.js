import RNFS from 'react-native-fs';
import Contacts from 'react-native-contacts';
if (!Date.prototype.toLocalISOString) {
  (function () {
    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }

    Date.prototype.toLocalISOString = function () {
      return (
        this.getFullYear() +
        '-' +
        pad(this.getMonth() + 1) +
        '-' +
        pad(this.getDate()) +
        'T' +
        pad(this.getHours()) +
        ':' +
        pad(this.getMinutes()) +
        ':' +
        pad(this.getSeconds()) +
        '.' +
        (this.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z'
      );
    };
  })();
}

export function urlencode(object) {
  var parameters = [];
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      parameters.push(property + '=' + encodeURIComponent(object[property]));
    }
  }
  return parameters.join('&');
}

export function parse_str(querystring) {
  // remove any preceding url and split
  querystring = querystring.substring(querystring.indexOf('?') + 1).split('&');
  var params = {},
    pair,
    d = decodeURIComponent;
  // march and parse
  for (var i = querystring.length - 1; i >= 0; i--) {
    pair = querystring[i].split('=');
    params[d(pair[0])] = d(pair[1] || '');
  }
  return params;
}

//import { useNavigation, useRoute, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {formatDistanceToNow, format, parse, parseISO} from 'date-fns';

export function getRemaining(end_date) {
  const endDate = parseISO(end_date);
  const remaining = formatDistanceToNow(endDate, {includeSeconds: true});
  const remainingWord = endDate > Date.now() ? 'remaining' : 'ago';
  return `${remaining} ${remainingWord}`;
}

import equal from 'deep-equal';
import moment from 'moment';
import {clearContacts} from './phonehelpers';
export function redirectToNewParams(
  navigation,
  route,
  newRoute,
  newRouteParams,
) {
  if (route.state?.routes) {
    const currentRoute = route.state.routes[route.state.routes.length - 1];
    if (currentRoute.name != newRoute) {
      return navigation.navigate(newRoute, newRouteParams);
    }
    if (!equal(currentRoute.params, newRouteParams)) {
      return navigation.push(newRoute, newRouteParams);
    }
    return false;
  } else {
    return navigation.push(newRoute, newRouteParams);
  }
}

export function serializeForURL(obj, prefix) {
  var str = [],
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + '[' + p + ']' : p,
        v = obj[p];
      str.push(
        v !== null && typeof v === 'object'
          ? serialize(v, k)
          : encodeURIComponent(k) + '=' + encodeURIComponent(v),
      );
    }
  }
  return str.join('&');
}

export function getDate(value) {
  if (!value || value == 'null' || value == null) {
    return getCurrentDate();
  }
  return parse(value, 'MMMM d, yyyy', new Date());
}
export function getCurrentDate() {
  return parseISO(new Date().toISOString());
}

export function formatDate(date, dateFormat) {
  return format(date, dateFormat);
}

export function getISODate(value) {
  return moment.utc(
    parse(value, 'MMMM d, yyyy', new Date()).toLocalISOString(),
  );
}

const escapeContact = (field) => {
  const replacer = (key, value) => (value === null ? '' : value);
  return JSON.stringify(field, replacer);
};

const unescapeContact = (data) => {
  return JSON.parse(data);
};

const prepareContactsForFile = (contacts) => {
  const items = contacts;
  const header = Object.keys(items[0]);
  const csv = [
    header.join(','), // header row first
    ...items.map((row) =>
      header.map((fieldName) => escapeContact(row[fieldName])).join(','),
    ),
  ].join('\r\n');
  return csv;
};
const parseContactsFromFile = (file) => {
  const contactsCSV = file.split('\r\n');
  const keys = contactsCSV.shift().split(',');
  const contacts = contactsCSV.map((contactCSV) => {
    const values = contactCSV.split(',');
    const contact = {};
    keys.map((k, i) => {
      contact[k] = unescapeContact(values[i]);
    });
    return contact;
  });
  return contacts;
};

const contactsPath = RNFS.DocumentDirectoryPath + '/contacts.csv';
export function getPhoneContactsFromDevice(geo) {
  return new Promise(async (resolve, reject) => {
    Contacts.getAllWithoutPhotos().then((fetchedContacts) => {
      const contacts = clearContacts(fetchedContacts, geo);
      RNFS.writeFile(contactsPath, prepareContactsForFile(contacts), 'utf8');
      resolve(contacts);
    });
  });
}

export function getPhoneContacts(geo) {
  return new Promise(async (resolve, reject) => {
    const exists = await RNFS.exists(contactsPath);
    if (exists) {
      try {
        const contacts = await RNFS.readFile(contactsPath, 'utf8');
        const parsedContacts = parseContactsFromFile(contacts);
        if (parsedContacts.length) {
          getPhoneContactsFromDevice(geo);
          resolve(parsedContacts);
        } else {
          resolve(await getPhoneContactsFromDevice(geo));
        }
      } catch (error) {
        const contacts = await getPhoneContactsFromDevice(geo);
        resolve(contacts);
      }
    } else {
      const contacts = await getPhoneContactsFromDevice(geo);
      resolve(contacts);
    }
  });
}
