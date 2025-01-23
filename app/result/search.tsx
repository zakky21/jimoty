'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AREA_TYPE, AREAS } from '@/lib/definitions/area';
import { Label } from '@radix-ui/react-label';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';

export default function Component({ keyword, threshold, areas }: { keyword?: string; threshold?: string; areas?: AREA_TYPE[] }) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [params, setParams] = useState({
    keyword: keyword || '',
    threshold: threshold || '500',
    areas: (areas || AREAS).map((a) => a.areaCd),
  });
  const handleSearch = () => {
    const p = new URLSearchParams();
    p.set('keyword', params.keyword);
    p.set('threshold', params.threshold);
    p.set('areas', params.areas.join(','));
    replace(`${pathname}?${p.toString()}`);
  };
  return (
    <>
      <div className="space-y-2">
        <div className="relative">
          <Label htmlFor="keyword">検索ワード</Label>
          <div className="absolute right-0 top-0"></div>
        </div>
        <div className="flex items-center gap-2">
          <Input id="keyword" name="keyword" value={params.keyword} onChange={({ target: { value } }) => setParams({ ...params, keyword: value })} />
        </div>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Label htmlFor="threshold">金額上限</Label>
          <div className="absolute right-0 top-0"></div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            id="threshold"
            name="threshold"
            value={params.threshold}
            onChange={({ target: { value } }) => setParams({ ...params, threshold: value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Label htmlFor="areas">検索エリア</Label>
          <div className="absolute right-0 top-0"></div>
        </div>
        <div className="flex items-center gap-2">
          {AREAS.map((area) => (
            <Fragment key={area.areaCd}>
              <Checkbox id={area.areaCd} value={area.areaCd} checked={params.areas.some((p) => p === area.areaCd)} />
              <label htmlFor={area.areaCd} className="text-xs">
                {area.areaNm}
              </label>
            </Fragment>
          ))}
        </div>
      </div>
      <Button onClick={handleSearch}>検索</Button>
    </>
  );
}
