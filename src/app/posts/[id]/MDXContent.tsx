// components/MDXContent.tsx
'use client';

import { useMDXComponent } from 'next-contentlayer/hooks';
import MDXComponents from "@/components/MDXComponents";

export function MDXContent({ code }: { code: string }) {
    const MDXComponent = useMDXComponent(code);

    return (
        // @ts-ignore
        <MDXComponent components={MDXComponents} />
    );
}