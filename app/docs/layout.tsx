import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        defaultOpenLevel: 0,
        tabs: [
          {
            title: 'Build',
            description: 'Implementation handoffs',
            url: '/docs/build',
          },
          {
            title: 'Architecture',
            description: 'Design docs and schematics',
            url: '/docs',
          },
        ],
      }}
    >
      {children}
    </DocsLayout>
  );
}
