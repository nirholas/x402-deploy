/**
 * enquirer interop shim.
 *
 * enquirer ships CommonJS with `export = Enquirer`, and Node's ESM loader
 * cannot detect `prompt` as a named export of it. Since this package builds to
 * ESM, `import { prompt } from "enquirer"` compiles fine but crashes the built
 * CLI on boot with:
 *
 *   SyntaxError: Named export 'prompt' not found. The requested module
 *   'enquirer' is a CommonJS module...
 *
 * Import the default here once and re-export the callable, so every CLI
 * command can keep using `import { prompt } from "../prompt.js"`.
 */
import Enquirer from "enquirer";

type PromptFn = typeof Enquirer.prompt;

export const prompt: PromptFn = Enquirer.prompt;
