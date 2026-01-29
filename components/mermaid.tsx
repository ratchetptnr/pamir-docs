'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Theme colors inspired by beautiful-mermaid (github-light / github-dark)
const lightThemeVars = {
  background: '#ffffff',
  primaryColor: '#dce6f0',
  primaryBorderColor: '#d1d9e0',
  primaryTextColor: '#1f2328',
  secondaryColor: '#e8eef4',
  secondaryBorderColor: '#d1d9e0',
  secondaryTextColor: '#1f2328',
  tertiaryColor: '#f0f4f8',
  tertiaryBorderColor: '#d1d9e0',
  tertiaryTextColor: '#1f2328',
  lineColor: '#59636e',
  textColor: '#1f2328',
  mainBkg: '#dce6f0',
  nodeBorder: '#d1d9e0',
  clusterBkg: '#f6f8fa',
  clusterBorder: '#d1d9e0',
  titleColor: '#1f2328',
  edgeLabelBackground: '#ffffff',
  nodeTextColor: '#1f2328',
};

const darkThemeVars = {
  background: '#0d1117',
  primaryColor: '#1c2533',
  primaryBorderColor: '#3d444d',
  primaryTextColor: '#e6edf3',
  secondaryColor: '#1a2332',
  secondaryBorderColor: '#3d444d',
  secondaryTextColor: '#e6edf3',
  tertiaryColor: '#151b25',
  tertiaryBorderColor: '#3d444d',
  tertiaryTextColor: '#e6edf3',
  lineColor: '#9198a1',
  textColor: '#e6edf3',
  mainBkg: '#1c2533',
  nodeBorder: '#3d444d',
  clusterBkg: '#151b25',
  clusterBorder: '#3d444d',
  titleColor: '#e6edf3',
  edgeLabelBackground: '#0d1117',
  nodeTextColor: '#e6edf3',
};

let idCounter = 0;

export function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const idRef = useRef(`mermaid-${idCounter++}`);

  const isDark = useCallback(() => {
    return document.documentElement.classList.contains('dark');
  }, []);

  const renderChart = useCallback(async () => {
    const dark = isDark();
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: dark ? darkThemeVars : lightThemeVars,
      flowchart: { curve: 'monotoneY', padding: 16 },
      fontFamily: 'Inter, system-ui, sans-serif',
      suppressErrorRendering: true,
    });

    try {
      const { svg: rendered } = await mermaid.render(
        idRef.current,
        chart.trim(),
      );
      setSvg(rendered);
    } catch {
      setSvg('');
    }
  }, [chart, isDark]);

  useEffect(() => {
    renderChart();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          // Re-generate unique ID to avoid mermaid cache collisions
          idRef.current = `mermaid-${idCounter++}`;
          renderChart();
          break;
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [renderChart]);

  if (!svg) {
    return (
      <div className="my-6 flex items-center justify-center rounded-lg border bg-fd-secondary p-8 text-sm text-fd-muted-foreground">
        Loading diagram…
      </div>
    );
  }

  return (
    <figure
      ref={containerRef}
      className="my-6 overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
