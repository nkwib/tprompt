<script>
  const PLAYGROUND_URL =
    'https://www.typescriptlang.org/play/#code/PTAEBcAcCcHsFtLggT0gUwLSwHYBsVQBncAVwCNQAzWaUAFQGVQAFPAQxQHM5ScATAHQAoEKACSOUO1DR07PKBiwAVugDGyFLFKgA7jrz990AJbh0oAAanEtZAG8lcRMgC+1F6ADkAARwA1nqm5MBQLkjeVqCAKASiYOAAFqZExGSUKaCm+NnoxonocsSwEAWsHNy8AqB42QH6tAGpwUk6yDiQ8CLC4GiWADLo4BZ0ALzCoKAAPj7s3tM+5PMz3urLPvzr3uhbVFtcW4lbplsq3hML3gFbeFvwWzhbsFuQWwCOW9BbRFvg55MrUhbABuWz0WwAHlsUFsAF7-S4AQS2ACEtgBhLYAES2AFEtgAxLYAcS2AAktuItgApBErADSW36WwAslsAHJbADyWxYWwAilsAEpbRhbeh0nwAVS2ADUtgB1LYADS2AE0tgAtLYAfW8AG4en0JPx0Yl2GNQINhoVLgAGbxTbwARkd3gATG6AMxugAsboArG6AGxugDsboAHG6AJwGo0YE30dimPAAHmY6AhFgEqRIZhwXAAfKBxpNM9n0LmfPMAPwQaCkdAXABcoArOf4qSsABIHOJTeboG4+9kqLahW5ovWB8nU2mhSW21QFER0IbeonxEQBxnQFnO3nwAXi6WLh2q13rH3rSMRw4xxOp6AZ-w5+nF6Bl6v1wnLLjs2gdhNDYYD0ESWAjEKIg9wPS8jxPAAaUBEXUdR90rat82yLhS1AHB0GBQoSzLdsMMPa8HGwws3AcBxRxwcc6FlNxWIYpjQCFdASCnC5JhnHd+DTWUSzg6tjybPjJhfUAAOPYDwFA9RwMg-hoIXbjwGQ1D0JmESpMmNs5KAkCOGUiCoOgGCuJIbS0KLKS2x0jdjVlC1THYcg8G4rkqDTFhyPgtITxIi4AG0WAAXUC6swoIojoGi+suPUWghOorhkPi4iv1AJw5HYfhcAIUAwvpLIpCitsMtANxDWyEYV2U0B0QQSBUzyWDMKvDKSwcC4WkSAAKYELSINs3LMTzvKIXy02MhSlJUyyYMYIsiwASmq48cMNNxhDU9QOCKKg+E0UxcGcNrwDTVKcBIMixJ6nbCyLIaLEQDgLDbRgtpatqOqEtbDXiUBAABSCHIah6GYdhuH4YRxHIdB+gyj0PIuHQNs5Bwdh4EsOjSCIaB2Tx9BWIgEpCbXEmyYp8h0DwWA9Ep0AjvkOgkksQo4GgEQxCRwWheF4XhGEO6Hp4dAhjw5RXCGi5vDJRmmeQ6nafx1iAEJQDVHQ6EgDgpEyOjDfYHB6FMQoKaGpn1AULG8ocO2HdYjbBHODaQaloZBEGob+smInClJ-G228BRTGU7xkLEQAEwlYOAMGgXofCJjWdiyVJ4BSIgcIq1AMGQ7xg4z+Yiu4-DYGQLMUnAC4zYtq3oHD5QY4uF3vPDqtMClMVhDcL3hCAA';
</script>

<svelte:head>
  <title>tprompt — type-safe prompt templates for TypeScript</title>
  <meta
    name="description"
    content="A 2KB primitive that turns prompt placeholder typos into tsc errors before they reach the model."
  />
</svelte:head>

<section class="hero">
  <div class="hero-grid">
    <div class="hero-copy">
      <span class="badge">
        <span class="dot" aria-hidden="true"></span>
        v0.1 · MIT · 2KB · zero deps
      </span>
      <h1>
        Catch prompt typos<br />
        <span class="accent">before</span> they reach the&nbsp;model.
      </h1>
      <p class="lede">
        <strong>tprompt</strong> is a 2KB TypeScript primitive that turns
        <code>{'{{usrName}}'}</code>
        into a <code>tsc</code> error — not a silent runtime string the model receives.
      </p>

      <div class="cta">
        <a class="btn primary" href="/docs">Read the docs</a>
        <a class="btn ghost" href={PLAYGROUND_URL} target="_blank" rel="noopener">
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
      </div>

      <pre class="install"><span class="prompt">$</span> pnpm add @nkwib/tprompt</pre>
    </div>

    <aside class="demo">
      <div class="demo-tab">
        <span class="dots" aria-hidden="true">
          <i></i><i></i><i></i>
        </span>
        <span class="filename">prompt.ts</span>
      </div>
      <pre class="demo-code"><code><span class="kw">import</span> &lbrace; prompt &rbrace; <span class="kw">from</span> <span class="str">'@nkwib/tprompt'</span>;

<span class="kw">const</span> <span class="fn">greet</span> = <span class="fn">prompt</span>(<span class="str">'Hello, &lbrace;&lbrace;userName&rbrace;&rbrace;!'</span>);

greet.<span class="fn">with</span>(&lbrace; <span class="prop">userName</span>: <span class="str">'Alice'</span> &rbrace;);
<span class="cmt">// → "Hello, Alice!"</span>

<span class="cmt">// Typo in the variables object →</span>
greet.<span class="fn">with</span>(&lbrace; <span class="bad">usrName</span>: <span class="str">'Alice'</span> &rbrace;);
<span class="err"
        ><span class="err-line"
          >//          ~~~~~~~ Property 'userName' is missing in type</span
        ><br /><span class="err-line"
          >//                  &lbrace; readonly usrName: string &rbrace;</span
        ></span></code></pre>
    </aside>
  </div>
</section>

<section class="features">
  <div class="features-inner">
    <div class="feature">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3>One primitive</h3>
      <p>
        <code>prompt('...&lbrace;&lbrace;name&rbrace;&rbrace;...')</code>. That's it. Variables are
        inferred at the type level from the literal string — no decorators, no
        codegen, no runtime schema.
      </p>
    </div>

    <div class="feature">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3>Typo-proof</h3>
      <p>
        <code>{'{{usrName}}'}</code> in the template + <code>userName</code> at the
        call site = compile error. Your prompt cannot ship with an unbound placeholder.
      </p>
    </div>

    <div class="feature">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 12h4l3-9 4 18 3-9h4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3>2KB. Zero deps.</h3>
      <p>
        <code>sideEffects: false</code>, ESM source, dual-published. Validation
        is structural — bring Zod, Valibot, ArkType, or your own.
      </p>
    </div>

    <div class="feature">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 6h16M4 12h16M4 18h10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <h3>Pluggable delimiter</h3>
      <p>
        Default is <code>{'{{var}}'}</code> (LangChain / BAML / OpenAI prompts).
        Single-brace via <code>tprompt/single-brace</code>. Custom via
        <code>makePromptTag</code>.
      </p>
    </div>

    <div class="feature">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3>Multi-turn ready</h3>
      <p>
        <code>.partial({'{role}'})</code> binds a subset; the rest is supplied
        later. Partials don't compose — by design — so the type stays honest.
      </p>
    </div>

    <div class="feature">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 2.42-1.001 3.42 3.42 0 0 1 4.83 0 3.42 3.42 0 0 0 2.42 1.001 3.42 3.42 0 0 1 3.41 3.41 3.42 3.42 0 0 0 1.001 2.42 3.42 3.42 0 0 1 0 4.83 3.42 3.42 0 0 0-1.001 2.42 3.42 3.42 0 0 1-3.41 3.41 3.42 3.42 0 0 0-2.42 1.001 3.42 3.42 0 0 1-4.83 0 3.42 3.42 0 0 0-2.42-1.001 3.42 3.42 0 0 1-3.41-3.41 3.42 3.42 0 0 0-1.001-2.42 3.42 3.42 0 0 1 0-4.83 3.42 3.42 0 0 0 1.001-2.42 3.42 3.42 0 0 1 3.41-3.41z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3>Optional runtime check</h3>
      <p>
        <code>.validate(schema)</code> throws; <code>.validateSafe(schema)</code>
        returns a Result. Two modes, no overlap. Pick one per call site.
      </p>
    </div>
  </div>
</section>

<section class="ports">
  <div class="ports-inner">
    <div class="ports-copy">
      <h2>Drop-in for the prompt ecosystem</h2>
      <p>
        Default <code>{'{{var}}'}</code> matches LangChain, BAML, the OpenAI
        prompt cookbook, and Anthropic's prompt library. Coming from f-string
        territory? One subpath import switches to <code>{'{var}'}</code>.
      </p>
      <a class="btn ghost compact" href="/docs#delimiters"
        >Delimiter guide
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M12 5l7 7-7 7"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          /></svg
        ></a
      >
    </div>
    <pre class="ports-code"><code><span class="cmt">// Default: {'{{var}}'}</span>
<span class="kw">import</span> &lbrace; prompt &rbrace; <span class="kw">from</span> <span class="str">'@nkwib/tprompt'</span>;
<span class="fn">prompt</span>(<span class="str">'Hi &lbrace;&lbrace;name&rbrace;&rbrace;'</span>);

<span class="cmt">// Single-brace: {'{var}'}</span>
<span class="kw">import</span> &lbrace; prompt &rbrace; <span class="kw">from</span> <span class="str">'@nkwib/tprompt/single-brace'</span>;
<span class="fn">prompt</span>(<span class="str">'Hi &lbrace;name&rbrace;'</span>);

<span class="cmt">// Bring your own:</span>
<span class="kw">import</span> &lbrace; makePromptTag &rbrace; <span class="kw">from</span> <span class="str">'@nkwib/tprompt'</span>;
<span class="kw">const</span> <span class="fn">angle</span> = <span class="fn">makePromptTag</span>(&lbrace; open: <span class="str">'&lt;&lt;'</span>, close: <span class="str">'&gt;&gt;'</span> &rbrace;);
</code></pre>
  </div>
</section>

<section class="cta-band">
  <div class="cta-band-inner">
    <h2>The whole library is one idea.</h2>
    <p>Variables only. No template logic. No DSL. No surprises.</p>
    <div class="cta">
      <a class="btn primary" href="/docs">Read the guide</a>
      <a class="btn ghost" href="/before-after">See it next to the AI SDK</a>
    </div>
  </div>
</section>

<style>
  /* Hero */
  .hero {
    padding: var(--sp-9) var(--sp-5) var(--sp-8);
    background:
      radial-gradient(circle at 80% -10%, var(--c-accent-soft), transparent 50%),
      radial-gradient(circle at 0% 100%, var(--c-bg-alt), transparent 60%),
      var(--c-bg);
    border-bottom: 1px solid var(--c-border);
  }

  .hero-grid {
    max-width: var(--wide-max);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: var(--sp-7);
    align-items: center;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    color: var(--c-text-muted);
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 4px 10px;
    border-radius: 999px;
    box-shadow: var(--sh-sm);
    margin-bottom: var(--sp-5);
  }

  .badge .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: var(--c-good);
    border-radius: 999px;
  }

  .hero h1 {
    font-size: clamp(2.25rem, 4.5vw, var(--fs-4xl));
    line-height: 1.05;
    letter-spacing: -0.04em;
    margin-bottom: var(--sp-5);
  }

  .accent {
    color: var(--c-accent);
    font-style: italic;
    font-weight: 700;
  }

  .lede {
    font-size: var(--fs-md);
    color: var(--c-text-muted);
    max-width: 38ch;
    margin-bottom: var(--sp-6);
  }

  .lede strong {
    color: var(--c-text);
    font-weight: 600;
  }

  .cta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-3);
    margin-bottom: var(--sp-5);
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
    transition:
      background 120ms ease,
      color 120ms ease,
      border-color 120ms ease,
      transform 120ms ease;
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

  .btn.ghost {
    background: transparent;
    color: var(--c-text);
    border-color: var(--c-border-strong);
  }

  .btn.ghost:hover {
    background: var(--c-bg-alt);
    text-decoration: none;
  }

  .btn.compact {
    padding: 0.5rem 0.85rem;
    font-size: var(--fs-sm);
  }

  .install {
    display: inline-block;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--r-md);
    padding: var(--sp-2) var(--sp-4);
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    color: var(--c-text);
    box-shadow: var(--sh-sm);
    margin: 0;
  }

  .install .prompt {
    color: var(--c-text-subtle);
    margin-right: var(--sp-2);
    user-select: none;
  }

  /* Demo card */
  .demo {
    background: var(--c-code-bg);
    border: 1px solid var(--c-border);
    border-radius: var(--r-lg);
    box-shadow: var(--sh-lg);
    overflow: hidden;
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
  }

  .demo-tab {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-3) var(--sp-4);
    border-bottom: 1px solid var(--c-border);
    background: var(--c-bg-alt);
    color: var(--c-text-subtle);
    font-size: var(--fs-xs);
  }

  .dots {
    display: inline-flex;
    gap: 6px;
  }

  .dots i {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: var(--c-border-strong);
    display: inline-block;
  }

  .dots i:nth-child(1) {
    background: var(--c-accent);
    opacity: 0.55;
  }
  .dots i:nth-child(2) {
    background: #f59e0b;
    opacity: 0.55;
  }
  .dots i:nth-child(3) {
    background: var(--c-good);
    opacity: 0.55;
  }

  .filename {
    font-family: var(--font-mono);
  }

  .demo-code {
    margin: 0;
    padding: var(--sp-5);
    background: transparent;
    color: var(--c-code-text);
    overflow-x: auto;
    font-size: var(--fs-sm);
    line-height: 1.7;
    font-family: var(--font-mono);
  }

  .demo-code code {
    background: transparent;
    border: 0;
    padding: 0;
    color: inherit;
    font-family: var(--font-mono);
    font-size: inherit;
  }

  .demo-code .kw {
    color: var(--c-code-keyword);
  }
  .demo-code .str {
    color: var(--c-code-string);
  }
  .demo-code .fn {
    color: var(--c-code-fn);
  }
  .demo-code .cmt {
    color: var(--c-code-comment);
    font-style: italic;
  }
  .demo-code .prop {
    color: var(--c-code-prop);
  }
  .demo-code .bad {
    color: var(--c-code-deleted);
    text-decoration: underline wavy var(--c-accent);
    text-underline-offset: 4px;
  }
  .demo-code .err {
    color: var(--c-accent);
  }
  .demo-code .err-line {
    display: inline;
  }

  /* Features */
  .features {
    padding: var(--sp-9) var(--sp-5);
  }

  .features-inner {
    max-width: var(--wide-max);
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sp-5);
  }

  .feature {
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    padding: var(--sp-5);
    border-radius: var(--r-lg);
    transition: border-color 120ms ease, transform 120ms ease;
  }

  .feature:hover {
    border-color: var(--c-border-strong);
  }

  .feature-icon {
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--c-bg-alt);
    border: 1px solid var(--c-border);
    border-radius: var(--r-md);
    color: var(--c-accent);
    margin-bottom: var(--sp-4);
  }

  .feature-icon svg {
    width: 18px;
    height: 18px;
  }

  .feature h3 {
    font-size: var(--fs-md);
    margin: 0 0 var(--sp-2);
    letter-spacing: -0.02em;
  }

  .feature p {
    color: var(--c-text-muted);
    margin: 0;
    font-size: var(--fs-sm);
    line-height: 1.65;
  }

  /* Ports band */
  .ports {
    padding: var(--sp-8) var(--sp-5);
    background: var(--c-bg-alt);
    border-top: 1px solid var(--c-border);
    border-bottom: 1px solid var(--c-border);
  }

  .ports-inner {
    max-width: var(--wide-max);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: var(--sp-7);
    align-items: center;
  }

  .ports-copy h2 {
    margin: 0 0 var(--sp-3);
    font-size: var(--fs-2xl);
    letter-spacing: -0.03em;
  }

  .ports-copy p {
    color: var(--c-text-muted);
    margin-bottom: var(--sp-5);
    font-size: var(--fs-md);
  }

  .ports-code {
    margin: 0;
    background: var(--c-code-bg);
    border: 1px solid var(--c-border);
    border-radius: var(--r-lg);
    padding: var(--sp-5);
    overflow-x: auto;
    color: var(--c-code-text);
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    line-height: 1.65;
    box-shadow: var(--sh-md);
  }

  .ports-code code {
    background: transparent;
    border: 0;
    padding: 0;
    color: inherit;
    font-family: var(--font-mono);
  }

  .ports-code .kw {
    color: var(--c-code-keyword);
  }
  .ports-code .str {
    color: var(--c-code-string);
  }
  .ports-code .fn {
    color: var(--c-code-fn);
  }
  .ports-code .cmt {
    color: var(--c-code-comment);
    font-style: italic;
  }

  /* CTA band */
  .cta-band {
    padding: var(--sp-9) var(--sp-5);
    text-align: center;
  }

  .cta-band-inner {
    max-width: 40rem;
    margin: 0 auto;
  }

  .cta-band h2 {
    font-size: var(--fs-2xl);
    margin-bottom: var(--sp-2);
    letter-spacing: -0.03em;
  }

  .cta-band p {
    color: var(--c-text-muted);
    margin-bottom: var(--sp-5);
    font-size: var(--fs-md);
  }

  .cta-band .cta {
    justify-content: center;
  }

  /* Responsive */
  @media (max-width: 960px) {
    .hero {
      padding: var(--sp-7) var(--sp-5) var(--sp-7);
    }

    .hero-grid {
      grid-template-columns: 1fr;
      gap: var(--sp-6);
    }

    .features-inner {
      grid-template-columns: 1fr;
    }

    .ports-inner {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .hero h1 {
      font-size: clamp(2rem, 8vw, 2.6rem);
    }
  }
</style>
