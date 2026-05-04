import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { prompt } from '../../src/index.js';

describe('.validate(schema)', () => {
  it('throws on invalid input', () => {
    const t = prompt('Hi {{name}}').validate(z.object({ name: z.string().min(3) }));
    expect(() => t.with({ name: 'al' })).toThrow();
  });

  it('renders on valid input', () => {
    const t = prompt('Hi {{name}}').validate(z.object({ name: z.string().min(3) }));
    expect(t.with({ name: 'alice' })).toBe('Hi alice');
  });

  it('preserves .partial after .validate when upstream had it', () => {
    const t = prompt('Hi {{name}}, role {{role}}').validate(
      z.object({ name: z.string(), role: z.string() })
    );
    const partial = t.partial({ name: 'Alice' });
    expect(partial.with({ role: 'admin' })).toBe('Hi Alice, role admin');
  });

  it('partial of validated still validates the merged input', () => {
    const t = prompt('Hi {{name}}, role {{role}}').validate(
      z.object({ name: z.string(), role: z.string().min(3) })
    );
    const partial = t.partial({ name: 'Alice' });
    expect(() => partial.with({ role: 'ad' })).toThrow();
  });

  it('PartialApplied.validate uses schema for the remaining keys only', () => {
    const t = prompt('Hi {{name}}, role {{role}}')
      .partial({ name: 'Alice' })
      .validate(z.object({ role: z.string().min(3) }));
    expect(() => t.with({ role: 'ad' })).toThrow();
    expect(t.with({ role: 'admin' })).toBe('Hi Alice, role admin');
  });
});

describe('.validateSafe(schema)', () => {
  it('returns ok=false on invalid input (does not throw)', () => {
    const t = prompt('Hi {{name}}').validateSafe(z.object({ name: z.string().min(3) }));
    const result = t.with({ name: 'al' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeDefined();
    }
  });

  it('returns ok=true with value on valid input', () => {
    const t = prompt('Hi {{name}}').validateSafe(z.object({ name: z.string().min(3) }));
    const result = t.with({ name: 'alice' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe('Hi alice');
    }
  });

  it('validateSafe.partial preserves safe-mode for the partial-applied template', () => {
    const t = prompt('Hi {{name}}, role {{role}}').validateSafe(
      z.object({ name: z.string(), role: z.string().min(3) })
    );
    const partial = t.partial({ name: 'Alice' });
    const bad = partial.with({ role: 'ad' });
    const good = partial.with({ role: 'admin' });
    expect(bad.ok).toBe(false);
    expect(good.ok).toBe(true);
    if (good.ok) expect(good.value).toBe('Hi Alice, role admin');
  });

  it('PartialApplied.validateSafe uses schema for the rest only', () => {
    const t = prompt('Hi {{name}}, role {{role}}')
      .partial({ name: 'Alice' })
      .validateSafe(z.object({ role: z.string().min(3) }));
    const bad = t.with({ role: 'ad' });
    const good = t.with({ role: 'admin' });
    expect(bad.ok).toBe(false);
    expect(good.ok).toBe(true);
    if (good.ok) expect(good.value).toBe('Hi Alice, role admin');
  });
});

describe('peer-dep boundary (ADR-0003 invariant 5)', () => {
  it('the library does not import zod at module load', async () => {
    const moduleSrc = await import('node:fs').then((fs) =>
      fs.readFileSync(new URL('../../src/index.ts', import.meta.url), 'utf8')
    );
    expect(moduleSrc).not.toMatch(/from\s+['"]zod['"]/);
    expect(moduleSrc).not.toMatch(/require\(['"]zod['"]\)/);
  });
});
