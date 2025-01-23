'use server';
import { AREA_TYPE } from '@/lib/definitions/area';
import axios, { AxiosError } from 'axios';
import * as parser from 'node-html-parser';
import { run } from 'node:test';

const NONE = '-';
const SKIP_WHEN_TITLE_UNMATCH = false;

export type ARRAY_TYPE = Awaited<ReturnType<typeof searchJimoty>>;
export type ELEMENT_TYPE = ARRAY_TYPE[number];

export async function searchJimoty({
  keywords,
  threshold,
  areas,
}: {
  keywords: string[];
  threshold: number;
  areas: AREA_TYPE[];
}) {
  return (
    await Promise.all(
      keywords.map(async (keyword) => {
        const encodedKeyword = encodeURI(keyword);
        return Promise.all(
          areas.map(async ({ prefecture, areaCd, areaNm }) => {
            let isLast = false;
            let page = 0;
            while (!isLast) {
              page += 1;
              const url =
                areaCd === NONE
                  ? `https://jmty.jp/${prefecture}/sale/p-${page}?keyword=${encodedKeyword}`
                  : `https://jmty.jp/${prefecture}/sale-all/g-all/${areaCd}/p-${page}?keyword=${encodedKeyword}`;

              let result = '';
              try {
                const { data } = await axios<string>(url, {
                  headers: {
                    'User-Agent':
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                  },
                });
                result = data;
              } catch (e) {
                const error = e as AxiosError;
                console.log(`error on status:[${error.message}]`, keyword, areaNm, url, error.toJSON());
                return;
              }

              console.log('call', areaNm, page);
              const root = parser.parse(result);
              for (let listItem of root.querySelectorAll('.p-articles-list-item')) {
                if (!!listItem.querySelector('.p-item-close-text')) {
                  isLast = true;
                  break;
                }
                const price = listItem.querySelector('.p-item-most-important')!.text.replace(/[,円]/g, '').trim();
                if (threshold < parseInt(price)) continue;
                const title = listItem.querySelector('.p-item-title a')!;
                const imageThumbnail = listItem.querySelector('.p-item-image-link img')!.getAttribute('src')!;
                const imageFullsize = imageThumbnail.replace(/thumb/g, 'slide')!;
                const link = title.getAttribute('href')!;
                const titleText = title.text;
                const dates = listItem.querySelector('.p-item-additional-info .p-item-history');

                if (SKIP_WHEN_TITLE_UNMATCH && !titleText.match(new RegExp(keyword))) {
                  continue;
                }

                if (!dates) {
                  continue;
                }

                const updatedAt = dates.querySelector('.u-margin-xs-b')?.text.trim();
                const createdAt = dates.querySelector('.u-color-gray')?.text.trim();
                return {
                  keyword,
                  areaCd,
                  areaNm,
                  imageThumbnail,
                  titleText,
                  imageFullsize,
                  price,
                  createdAt,
                  updatedAt,
                  link,
                };
              }
              isLast = isLast || !root.querySelector('.c-paginate .last');
            }
          }),
        );
      }),
    )
  )
    .flat()
    .filter((v) => !!v);
  // for (let keyword of KEYWORDS) {
  //   const encodedKeyword = encodeURI(keyword);
  //   for (let [prefectures, areaCd, areaNm] of AREAS) {
  //     if (!SEARCH_ALL && areaCd === NONE) break;
  //     let isLast = false;
  //     let page = 0;
  //     while (!isLast) {
  //       page += 1;
  //       const url =
  //         areaCd === NONE
  //           ? `https://jmty.jp/${prefectures}/sale/p-${page}?keyword=${encodedKeyword}`
  //           : `https://jmty.jp/${prefectures}/sale-all/g-all/${areaCd}/p-${page}?keyword=${encodedKeyword}`;
  //       let result = '';
  //       try {
  //         const { data } = await axios<string>(url);
  //         result = data;
  //       } catch (e) {
  //         const error = e as AxiosError;
  //         console.log(`error on status:[${error.message}]`, keyword, areaNm);
  //       }

  //       const root = parser.parse(result);
  //       for (let listItem of root.querySelectorAll('.p-articles-list-item')) {
  //         if (!!listItem.querySelector('.p-item-close-text')) {
  //           isLast = true;
  //           break;
  //         }
  //         const price = listItem.querySelector('.p-item-most-important')!.text.replace(/[,円]/g, '').trim();
  //         if (threshold < parseInt(price)) continue;
  //         const title = listItem.querySelector('.p-item-title a')!;
  //         const imageThumbnail = listItem.querySelector('.p-item-image-link img')!.getAttribute('src')!;
  //         const imageFullsize = imageThumbnail.replace(/thumb/g, 'slide');
  //         const link = title.getAttribute('href');
  //         const titleText = title.text;
  //         const dates = listItem.querySelector('.p-item-additional-info .p-item-history');

  //         if (SKIP_WHEN_TITLE_UNMATCH && !titleText.match(new RegExp(keyword))) {
  //           continue;
  //         }

  //         if (!dates) {
  //           continue;
  //         }

  //         const updatedAt = dates.querySelector('.u-margin-xs-b')?.text.trim();
  //         const createdAt = dates.querySelector('.u-color-gray')?.text.trim();
  //         const messages = [
  //           `検索条件:${keyword} / エリア:${areaNm} / 金額:${threshold}円以下,
  //           ${titleText},
  //           ${price}円,
  //           ${createdAt}(${updatedAt}),
  //           ${link}`,
  //         ];
  //         await sendLine({ imageThumbnail, imageFullsize, message: messages.join('\n') }).catch(console.log);
  //         printHTML({ image: imageFullsize, messages, link });
  //       }
  //       isLast = isLast || !root.querySelector('.c-paginate .last');
  //     }
  //   }
  // }
}
try {
  run();
} catch (e) {
  console.log('e', e);
}
