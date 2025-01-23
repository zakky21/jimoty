import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AREA_TYPE, fetchFromCd } from '@/lib/definitions/area';
import { ELEMENT_TYPE, searchJimoty } from '@/lib/jimoty';
import { isNotNilEmpty } from '@/lib/wrapper/ramda';
import RowComponent from './row';
import SearchComponent from './search';

export default async function Component(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = parse(await props.searchParams);
  const results = await _searchJimoty(params);
  return (
    <div className="flex flex-col bg-background">
      <div className="space-y-6 p-6">
        <SearchComponent {...params} />

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[initial]">
              <TableHead>サムネ</TableHead>
              <TableHead>area</TableHead>
              <TableHead>title</TableHead>
              <TableHead>price</TableHead>
              <TableHead>date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result: ELEMENT_TYPE, i) => (
              <RowComponent key={i} {...result} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
function parse(params: { [key: string]: string | undefined }) {
  const keyword = params['keyword'];
  const threshold = params['threshold'];
  const areas = params['areas'];
  return {
    keyword: keyword,
    threshold: threshold,
    areas: isNotNilEmpty(areas) ? fetchFromCd(areas!.split(',')) : undefined,
  };
}
async function _searchJimoty({ keyword, threshold, areas }: { keyword?: string; threshold?: string; areas?: AREA_TYPE[] }) {
  console.log('_searchJimoty', keyword, threshold, areas);
  if (!keyword || !threshold || !areas) return [];
  return await searchJimoty({
    keywords: [keyword],
    threshold: parseInt(threshold),
    areas,
  });
}
