<script>
  let { children } = $props();
</script>

<main>
  {@render children()}
</main>

<style>
  :global(html) {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #1f2328;
    background: #fff;
  }

  :global(body) {
    margin: 0;
  }

  main {
    max-width: 44rem;
    margin: 0 auto;
    padding: 3rem 1.25rem;
  }

  :global(h1) {
    font-size: 2rem;
    margin-bottom: 0.25rem;
  }

  :global(h2) {
    font-size: 1.25rem;
    margin-top: 2rem;
  }

  :global(code) {
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
    background: #f6f8fa;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    font-size: 0.9em;
  }

  :global(a) {
    color: #0969da;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
</style>
