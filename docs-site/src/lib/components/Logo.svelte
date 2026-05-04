<script>
  let { size = 28 } = $props();
</script>

<span class="logo" style="--s: {size}px">
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    aria-hidden="true"
    role="img"
    fill="none"
  >
    <rect x="1" y="1" width="30" height="30" rx="7" stroke="currentColor" stroke-width="1.5" />
    <path
      d="M9 11l3 3-3 3"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M14 20h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
  </svg>
  <span class="wordmark">tprompt</span>
</span>

<style>
  .logo {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    color: var(--c-text);
    font-weight: 600;
    letter-spacing: -0.02em;
    font-size: 1.05rem;
  }

  .wordmark {
    font-family: var(--font-mono);
    font-size: 0.95rem;
  }
</style>
