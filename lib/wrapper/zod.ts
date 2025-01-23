import i18next from 'i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
// Import your language translation files
import translation from 'zod-i18n-map/locales/ja/zod.json';

// lng and resources key depend on your locale.
i18next.init({
  lng: 'ja',
  resources: {
    ja: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

// export configured zod instance
export * from 'zod';
export { z };

export const zodEnumFromArray = <K extends string>(array: K[]): z.ZodEnum<[K, ...K[]]> => {
  const [firstKey, ...otherKeys] = array;
  if (typeof firstKey !== 'string') throw new Error('array-value is not string');
  return z.enum([firstKey, ...otherKeys]);
};

export const zodEnumFromObjKeys = <K extends string>(obj: Record<K, unknown>): z.ZodEnum<[K, ...K[]]> => {
  const [firstKey, ...otherKeys] = Object.keys(obj) as K[];
  if (typeof firstKey !== 'string') throw new Error('key is not string');
  return z.enum([firstKey, ...otherKeys]);
};
