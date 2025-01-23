'use client';

import { Label as SLabel } from '@/components/ui/label';
import * as LabelPrimitive from '@radix-ui/react-label';

import * as React from 'react';

import { cn } from '@/lib/utils/cn';

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(
  ({ className, ...props }, ref) => <SLabel ref={ref} className={cn('font-semibold', className)} {...props} />,
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
