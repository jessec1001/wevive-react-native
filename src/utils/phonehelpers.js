import phoneCodes from '../../phones.json';
export const clearPhoneNumber = (country, number) => {
  if (number) {
    let cleanNumber = number.replace(/[^0-9+]+/g, '');
    if (cleanNumber.indexOf('+') !== 0) {
      cleanNumber =
        getCountryPhoneCode(country) + removeTrunkPrefix(country, cleanNumber);
    }
    return cleanNumber;
  }
  return number;
};
export const removeTrunkPrefix = (country, number) => {
  const non_standard_prefixes = {
    AZ: '8',
    MX: '01',
    MN: '01|02',
    TM: '8',
    UZ: '8',
    KZ: '8',
    RU: '8',
    BY: '8',
    HU: '06',
    LT: '8',
  };
  let trunkPrefix = '0';
  if (country && typeof non_standard_prefixes[country] !== 'undefined') {
    trunkPrefix = non_standard_prefixes[country];
  }
  const trunkPrefixRegex = new RegExp(`^(${trunkPrefix})`, 'g');
  return number.replace(trunkPrefixRegex, '');
};

export const getCountryPhoneCode = (country) => {
  if (!country || !phoneCodes[country]) {
    return;
  }
  if (Array.isArray(phoneCodes[country])) {
    return `+${phoneCodes[country][0]}`;
  } else {
    return `+${phoneCodes[country]}`;
  }
};
