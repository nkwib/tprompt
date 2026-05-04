<script>
  let { data } = $props();

  const PLAYGROUND_URL =
    'https://www.typescriptlang.org/play/#code/PTAEBcAcCcHsFtLggT0gUwLSwHYBsVQBncAVwCNQAzWaUAFQGVQAFPAQxQHM5ScATAHQAoEKACSOUO1DR07PKBiwAVugDGyFLFKgA7jrz990AJbh0oAAanEtZAG8lcRMgC+1F6ADkUF0m8rUEAUAlEwcAALUyJiMkpo0FN8JPRjCPQ5YlgIdNYObl4BUDwkgGt9WlKYvXMInWQcSHgRYXA0SwAZdHALOgBeYVBQAB8fdm8Rn3IJ0e91GZ9+Be90ZaplrmWI5dNllW9Bye9S5bxl+GWcZdhlyGWAR2XoZaJl8AOh2dJlgDdlvWWAA9lihlgAvD5HACCywAQssAMLLAAiywAossAGLLADiywAEstxMsAFKQ2YAaWWHWWAFllgA5ZYAeWWLGWAEVlgAlZaMZb0ck+ACqywAassAOrLAAaywAmssAFrLAD63gA3K12hJ+AiIux+qAuj0MkcAAzeYbeACMVu8ACZ7QBme0AFntAFZ7QA2e0AdntAA57QBOTXajC6+jsUx4AA8zHQgIsAhiJDMOC4AD5QAMhkmU+g0z4JgB+CDQUjoQ4ALlAhdT-BiVgAJA5xHqDdA3O2klQzdy3EEK52Y3H49zc-WqAoiOgtW0o+IiJ3E6Bk030+BMzm84dG8Xm9Z2yber2HP3B8PQKP+OOE1PQDO5wvI5Y0SnoOxNGwf+g6iMDIiHXTcj23XcABpQChdR1A3IsSwzJIuDzUAcHQH4MlzfMGwQrcTwcZCszcBwHD7HABzoMU3FoiiqNAbl0BIYdDiGUdV34eMxVzMCSx3as2KGW9QE-Hcf3AP91AA2AgOgECmJIaDYPg0YeKEoZ6zE79fw4aTAP4YDJ2Y8BlLg7MhPrFTFx1MVDVMdhyDwZjmSoeMWHw8DYl3HDDgAbRYABdTySz8jCsOgYKKyY9RaC44iuGg8LsOfUAnDkdh+FwAhQD8ilEikIL6wS0A3C1JJelnaTQARBBIDjVJQMQ48EtzBxDhqSIAAofkNIh6zssxHOcohXPjbSJKkmS5JAxhs2zABKYqdxQrU3GEQz1A4TIqD4TRTFwZw6vAeNYpwEg8L4lqVqzbMuosRAOAsetGCWmq6oari5q1MJQEAAFIAcBoHgZB0GwfBiHIcB376FyPRUi4dB6zkHB2HgSwyNIIhoAZNH0FoiBskx+ccbxgnyHQPBYD0QnQC2+Q6EiSwMjgaARDEKHOa57nueEYQzounh0G6NDlFcLrDm8fFKap6DidJ9HaIAQlAeUdDoSAOCkBIyM19gcHoUwMgJrqqfUBQkbShwzYt2iFsEA4Fp+oXukETqIi69qhixjJcfR+tvAUUxpO8aCxEABMJWDgDBoDaHwsYV1ZEhieBoiIFCCtQDBoO8H3E4mLLmPQ2BkGTVxDj1g2jegAPlFDw4becgPi0wYV+WENwneEIA';
</script>

<svelte:head>
  <title>tprompt — before / after with the Vercel AI SDK</title>
  <meta
    name="description"
    content="A real multi-variable system prompt across the Vercel AI SDK. Same data flow, same model call. The only difference is when the typo gets caught."
  />
</svelte:head>

<div class="ba-page">
  <header class="ba-hero">
    <a href="/" class="back-link">← Back to home</a>
    <h1>Before / after — Vercel AI SDK</h1>
    <p class="lede">
      A real multi-variable system prompt: <code>{'{{userName}}'}</code>,
      <code>{'{{planTier}}'}</code>, <code>{'{{locale}}'}</code>. Same data
      flow, same model call. The only difference is when the typo gets caught.
    </p>
  </header>

  <div class="comparison">
    <div class="col before">
      <div class="col-header">
        <span class="tag bad">Before</span>
        <span class="title">Vanilla string template</span>
      </div>
      <pre class="code-block language-typescript" data-lang="typescript"><code class="language-typescript">{@html data.before}</code></pre>
      <p class="caption">
        The <code>replace</code> for <code>{'{{userName}}'}</code> doesn't match
        anything (the template has <code>{'{{usrName}}'}</code>), so the literal
        <code>{'{{usrName}}'}</code> reaches the model. The runtime works; the
        prompt is silently broken.
      </p>
    </div>

    <div class="col after">
      <div class="col-header">
        <span class="tag good">After</span>
        <span class="title">tprompt</span>
      </div>
      <pre class="code-block language-typescript" data-lang="typescript"><code class="language-typescript">{@html data.after}</code></pre>
      <p class="caption">
        <code>tsc</code> rejects this file before <code>node</code> ever runs.
        Either fix the template (<code>{'{{userName}}'}</code>) or fix the call
        site (<code>usrName: 'alice'</code>) — the typo cannot land in
        production.
      </p>
    </div>
  </div>

  <section class="diff-callout">
    <h2>The wedge, in three lines of diff</h2>
    <pre class="code-block language-diff" data-lang="diff"><code class="language-diff">{@html data.diff}</code></pre>
  </section>

  <section class="cta-band">
    <h2>Try it</h2>
    <p>
      The Playground has the after-snippet pre-loaded. Rename
      <code>{'{{usrName}}'}</code> back to <code>{'{{userName}}'}</code> in the
      template literal — the error clears.
    </p>
    <a class="btn primary" href={PLAYGROUND_URL} target="_blank" rel="noopener">
      Open in TS Playground
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 17L17 7M17 7H9M17 7V15"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
  </section>
</div>

<style>
  .ba-page {
    max-width: var(--wide-max);
    margin: 0 auto;
    padding: var(--sp-7) var(--sp-5) var(--sp-9);
  }

  .ba-hero {
    max-width: 50rem;
    margin: 0 auto var(--sp-7);
    text-align: center;
  }

  .back-link {
    display: inline-block;
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
    text-decoration: none;
    margin-bottom: var(--sp-4);
  }

  .back-link:hover {
    color: var(--c-text);
    text-decoration: underline;
  }

  h1 {
    font-size: clamp(2rem, 4.5vw, var(--fs-3xl));
    margin-bottom: var(--sp-3);
    margin-top: 0;
    letter-spacing: -0.03em;
  }

  .lede {
    color: var(--c-text-muted);
    font-size: var(--fs-md);
    margin: 0;
  }

  .comparison {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--sp-5);
    margin-bottom: var(--sp-7);
    align-items: stretch;
  }

  .col {
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--r-lg);
    padding: var(--sp-5);
    box-shadow: var(--sh-sm);
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .col.before {
    border-left: 3px solid var(--c-accent);
  }

  .col.after {
    border-left: 3px solid var(--c-good);
  }

  .col-header {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    margin-bottom: var(--sp-2);
  }

  .tag {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 3px 8px;
    border-radius: var(--r-sm);
    font-weight: 600;
  }

  .tag.bad {
    background: var(--c-accent-soft);
    color: var(--c-accent);
  }

  .tag.good {
    background: var(--c-good-soft);
    color: var(--c-good);
  }

  .title {
    font-weight: 600;
    color: var(--c-text);
    font-size: var(--fs-md);
  }

  .col pre.code-block {
    margin: var(--sp-3) 0;
    flex: 1;
  }

  .caption {
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
    margin: var(--sp-2) 0 0;
  }

  .diff-callout {
    background: var(--c-bg-alt);
    border: 1px solid var(--c-border);
    border-radius: var(--r-lg);
    padding: var(--sp-5) var(--sp-6);
    margin-bottom: var(--sp-7);
  }

  .diff-callout h2 {
    margin: 0 0 var(--sp-3);
    font-size: var(--fs-lg);
    letter-spacing: -0.02em;
  }

  .diff-callout pre.code-block {
    margin-bottom: 0;
  }

  .cta-band {
    text-align: center;
    padding: var(--sp-5) 0 0;
    max-width: 40rem;
    margin: 0 auto;
  }

  .cta-band h2 {
    font-size: var(--fs-xl);
    margin-bottom: var(--sp-2);
    margin-top: 0;
  }

  .cta-band p {
    color: var(--c-text-muted);
    margin-bottom: var(--sp-4);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    padding: 0.65rem 1.1rem;
    border-radius: var(--r-md);
    font-size: var(--fs-sm);
    font-weight: 500;
    text-decoration: none;
    border: 1px solid transparent;
    transition: background 120ms ease, border-color 120ms ease, color 120ms ease;
  }

  .btn.primary {
    background: var(--c-text);
    color: var(--c-bg);
    border-color: var(--c-text);
  }

  .btn.primary:hover {
    background: var(--c-accent);
    border-color: var(--c-accent);
    color: var(--c-accent-fg);
    text-decoration: none;
  }

  @media (max-width: 960px) {
    .comparison {
      grid-template-columns: 1fr;
    }
  }
</style>
