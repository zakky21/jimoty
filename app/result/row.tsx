'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { ELEMENT_TYPE } from '@/lib/jimoty';
import { useRouter } from 'next/navigation';
export default function Component({ areaNm, titleText, imageThumbnail, price, createdAt, updatedAt, link }: ELEMENT_TYPE) {
  console.log('row!');
  const router = useRouter();
  return (
    <TableRow>
      <TableCell>
        <a href={link} target="_blank">
          <img src={imageThumbnail} height="120" width="120" />
        </a>
      </TableCell>
      <TableCell>{areaNm}</TableCell>
      <TableCell>{titleText}</TableCell>
      <TableCell>{price}円</TableCell>
      <TableCell>
        {createdAt}({updatedAt})
      </TableCell>
    </TableRow>
  );
}
