import { highlight } from '$lib/highlight.js';

export const prerender = true;

const beforeCode = `import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const userName = 'alice';
const planTier = 'pro';
const locale = 'en-US';

// Typo intended to be {{userName}} — silently ships to the model.
const system = 'You are a support agent for {{usrName}} on plan {{planTier}}, locale {{locale}}.'
  .replace('{{userName}}', userName)
  .replace('{{planTier}}', planTier)
  .replace('{{locale}}', locale);

const { text } = await generateText({
  model: openai('gpt-4o-mini'),
  system,
  prompt: 'How do I upgrade my plan?'
});

// system is:
// "You are a support agent for {{usrName}} on plan pro, locale en-US."
//                                  ^^^^^^^ leaks to the model`;

const afterCode = `import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { prompt } from '@nkwib/tprompt';

const supportSystem = prompt(
  'You are a support agent for {{usrName}} on plan {{planTier}}, locale {{locale}}.'
);

const { text } = await generateText({
  model: openai('gpt-4o-mini'),
  system: supportSystem.with({
    userName: 'alice',
    //  ^^^^^^^^ TS error: Property 'usrName' is missing in type
    //           '{ readonly userName: string; readonly planTier: string;
    //             readonly locale: string; }', but the call expects
    //           '{ readonly usrName: string; readonly planTier: string;
    //             readonly locale: string; }'.
    planTier: 'pro',
    locale: 'en-US'
  }),
  prompt: 'How do I upgrade my plan?'
});`;

const diffCode = `-const system = 'You are a support agent for {{usrName}}...'
-  .replace('{{userName}}', userName)
+const supportSystem = prompt('You are a support agent for {{usrName}}...');
+supportSystem.with({ userName: 'alice', planTier, locale });
+//                   ~~~~~~~~ tsc: Property 'usrName' is missing`;

export function load() {
  return {
    before: highlight(beforeCode, 'typescript'),
    after: highlight(afterCode, 'typescript'),
    diff: highlight(diffCode, 'diff')
  };
}
