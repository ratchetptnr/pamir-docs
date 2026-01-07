'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export function Mermaid({ chart }: { chart: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            mermaid.initialize({
                startOnLoad: true,
                theme: 'default',
            });
            mermaid.contentLoaded();
        }
    }, [chart]);

    return (
        <div className="mermaid" ref={ref}>
            {chart}
        </div>
    );
}
