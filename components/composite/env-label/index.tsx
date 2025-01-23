'use client';

import { useState } from 'react';

const COLORS = {
  local: {
    textColor: 'text-violet-100',
    bgColor: 'bg-violet-600',
  },
  PullRequest: {
    textColor: 'text-blue-100',
    bgColor: 'bg-blue-600',
  },
  develop: {
    textColor: 'text-red-100',
    bgColor: 'bg-red-600',
  },
} as const;

export default function Component() {
  const [visible, setVisible] = useState(true);
  if (process.env.NEXT_PUBLIC_ENV === 'prod') return;

  const color = COLORS[(process.env.NEXT_PUBLIC_ENV || 'local') as keyof typeof COLORS];
  return visible ? (
    <div className="fixed right-0 top-0 z-50 size-40 overflow-hidden">
      <div
        className={`absolute right-[-60px] top-8 w-[240px] translate-x-0 rotate-45 opacity-100 shadow-lg transition-all duration-500 ease-out ${color.bgColor}`}
      >
        <div className="relative py-2 text-center" onClick={() => setVisible(false)}>
          <div className={`text-sm font-bold ${color.textColor} tracking-wide`}>{process.env.NEXT_PUBLIC_ENV}</div>
          <div className={`text-xs ${color.textColor} mt-1 font-medium`}>環境</div>
        </div>
      </div>
    </div>
  ) : null;
}
