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

// Detect if a hex color is "light" (needs dark text for contrast)
function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length < 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 150;
}

// Extract fill color from an SVG element (attribute or inline style)
function getFill(el: Element): string | null {
  const attr = el.getAttribute('fill');
  if (attr && attr.startsWith('#')) return attr;
  const style = el.getAttribute('style') || '';
  const match = style.match(/fill:\s*(#[0-9a-fA-F]{3,8})/);
  return match ? match[1] : null;
}

// In dark mode, nodes with light fill need dark text for contrast
function fixDarkModeContrast(svgString: string): string {
  // Mermaid uses HTML <br> inside <foreignObject> — normalize to XHTML for XML parsing
  const normalized = svgString.replace(/<br\s*(?!\/)>/gi, '<br/>');
  const parser = new DOMParser();
  const doc = parser.parseFromString(normalized, 'image/svg+xml');

  // If parsing failed, return original SVG untouched
  if (doc.querySelector('parsererror')) return svgString;

  const darkText = '#1f2328';

  doc.querySelectorAll('.node, .label').forEach((node) => {
    const shapes = node.querySelectorAll('rect, polygon, circle, ellipse, path');
    let hasLightBg = false;
    shapes.forEach((shape) => {
      const fill = getFill(shape);
      if (fill && isLightColor(fill)) hasLightBg = true;
    });
    if (hasLightBg) {
      node.querySelectorAll('span, p').forEach((el) => {
        (el as HTMLElement).style.color = darkText;
      });
      node.querySelectorAll('text, tspan').forEach((el) => {
        el.setAttribute('fill', darkText);
      });
    }
  });

  return new XMLSerializer().serializeToString(doc);
}

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
      setSvg(dark ? fixDarkModeContrast(rendered) : rendered);
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
