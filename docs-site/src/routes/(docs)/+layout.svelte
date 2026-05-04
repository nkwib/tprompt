<script>
  import Sidebar from '$lib/components/Sidebar.svelte';

  let { children } = $props();

  const sections = [
    {
      label: 'Guide',
      items: [
        { href: '/docs', label: 'Overview' },
        { href: '/docs#installation', label: 'Installation' },
        { href: '/docs#usage', label: 'Quick start' },
        { href: '/docs#partial', label: 'Partial application' },
        { href: '/docs#validation', label: 'Validation' },
        { href: '/docs#delimiters', label: 'Delimiters' },
        { href: '/docs#esm-cjs', label: 'ESM / CJS' },
        { href: '/docs#non-goals', label: 'Non-goals' }
      ]
    },
    {
      label: 'Reference',
      items: [
        { href: '/api', label: 'API' },
        { href: '/glossary', label: 'Glossary' }
      ]
    },
    {
      label: 'Decisions',
      items: [
        { href: '/adr', label: 'Overview' },
        { href: '/adr/0001-default-delimiter', label: 'ADR-0001 · Delimiter' },
        { href: '/adr/0002-pluggable-parser-architecture', label: 'ADR-0002 · Parser' },
        { href: '/adr/0003-esm-cjs-interop-boundary', label: 'ADR-0003 · ESM/CJS' }
      ]
    }
  ];
</script>

<div class="docs-shell">
  <Sidebar {sections} />
  <article class="docs-article">
    {@render children()}
  </article>
</div>

<style>
  .docs-shell {
    max-width: var(--wide-max);
    margin: 0 auto;
    padding: 0 var(--sp-5);
    display: grid;
    grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
    gap: var(--sp-7);
    align-items: start;
  }

  .docs-article {
    padding: var(--sp-7) 0 var(--sp-9);
    max-width: var(--content-max);
    width: 100%;
  }

  .docs-article :global(h1) {
    font-size: var(--fs-2xl);
    margin-top: 0;
  }

  @media (max-width: 960px) {
    .docs-shell {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .docs-article {
      padding: var(--sp-4) 0 var(--sp-7);
    }
  }
</style>
