<script>
  let { data } = $props();

  const PLAYGROUND_URL =
    'https://www.typescriptlang.org/play/#code/PTAEBcAcCcHsFtLggT0gUwLSwHYBsVQBncAVwCNQAzWaUAFQGVQAFPAQxQHM5ScATAHQAoEKACSOUO1DR07PKBiwAVugDGyFLFKgA7jrz990AJbh0oAAanEtZAG8lcRMgC+1F6ADkAARwA1nqm5MBQLkjeVqCAKASiYOAAFqZExGSUKaCm+NnoxonocsSwEAWsHNy8AqB42QH6tAGpwUk6yDiQ8CLC4GiWADLo4BZ0ALzCoKAAPj7s3tM+5PMz3urLPvzr3uhbVFtcW4lbplsq3hML3gFbeFvwWzhbsFuQWwCOW9BbRFvg55MrUhbABuWz0WwAHlsUFsAF7-S4AQS2ACEtgBhLYAES2AFEtgAxLYAcS2AAktuItgApBErADSW36WwAslsAHJbADyWxYWwAilsAEpbRhbeh0nwAVS2ADUtgB1LYADS2AE0tgAtLYAfW8AG4en0JPx0Yl2GNQINhoVLgAGbxTbwARkd3gATG6AMxugAsboArG6AGxugDsboAHG6AJwGo0YE30dimPAAHmY6AhFgEqRIZhwXAAfKBxpNM9n0LmfPMAPwQaCkdAXABcoArOf4qSsABIHOJTeboG4+9kqLahW5ovWB8nU2mhSW21QFER0IbeonxEQBxnQFnO3nwAXi6WLh2q13rH3rSMRw4xxOp6AZ-w5+nF6Bl6v1wnLLjs2gdhNDYYD0ESWAjEKIg9wPS8jxPAAaUBEXUdR90rat82yLhS1AHB0GBQoSzLdsMMPa8HGwws3AcBxRxwcc6FlNxWIYpjQCFdASCnC5JhnHd+DTWUSzg6tjybPjJhfUAAOPYDwFA9RwMg-hoIXbjwGQ1D0JmESpMmNs5KAkCOGUiCoOgGCuJIbS0KLKS2x0jdjVlC1THYcg8G4rkqDTFhyPgtITxIi4AG0WAAXUC6swoIojoGi+suPUWghOorhkPi4iv1AJw5HYfhcAIUAwvpLIpCitsMtANxDWyEYV2U0B0QQSBUzyWDMKvDKSwcC4WkSAAKYELSINs3LMTzvKIXy02MhSlJUyyYMYIsiwASmq48cMNNxhDU9QOCKKg+E0UxcGcNrwDTVKcBIMixJ6nbCyLIaLEQDgLDbRgtpatqOqEtbDXiUBAABSCHIah6GYdhuH4YRxHIdB+gyj0PIuHQNs5Bwdh4EsOjSCIaB2Tx9BWIgEpCbXEmyYp8h0DwWA9Ep0AjvkOgkksQo4GgEQxCRwWheF4XhGEO6Hp4dAhjw5RXCGi5vDJRmmeQ6nafx1iAEJQDVHQ6EgDgpEyOjDfYHB6FMQoKaGpn1AULG8ocO2HdYjbBHODaQaloZBEGob+smInClJ-G228BRTGU7xkLEQAEwlYOAMGgXofCJjWdiyVJ4BSIgcIq1AMGQ7xg4z+Yiu4-DYGQLNXAuM2Lat6Bw+UGOLhd7zw6rTApTFYQ3C94QgA';
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
