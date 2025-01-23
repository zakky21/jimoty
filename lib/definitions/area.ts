export type AREA_TYPE = (typeof AREAS)[number];
export const AREAS = [
  { prefecture: 'saitama', areaCd: 'a-203-wako', areaNm: '和光' },
  { prefecture: 'saitama', areaCd: 'a-204-niiza', areaNm: '新座' },
  { prefecture: 'saitama', areaCd: 'a-202-shiki', areaNm: '志木' },
  { prefecture: 'saitama', areaCd: 'a-201-asaka', areaNm: '朝霞' },
  { prefecture: 'tokyo', areaCd: 'a-275-nerima', areaNm: '練馬' },
  { prefecture: 'tokyo', areaCd: 'a-298-higashikurume', areaNm: '東久留米' },
  { prefecture: 'tokyo', areaCd: 'a-304-nishitokyo', areaNm: '西東京' },
];

export function fetchFromCd(code: string | string[]) {
  const codes = Array.isArray(code) ? code : [code];
  return AREAS.filter((area) => codes.some((p) => p === area.areaCd));
}
