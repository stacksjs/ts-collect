// Guards against publishing a broken bundle: ts-collect 0.4.1/0.4.2 shipped a
// dist that was tree-shaken to an export stub with no declarations, so any
// consumer crashed on import. This imports the built dist and exercises it;
// prepublishOnly runs it so a dist that can't be imported can't be published.
function fail(message: string): never {
  console.error(`smoke-dist: ${message}`)
  process.exit(1)
}

const distEntry = new URL('../dist/index.js', import.meta.url).href

let mod: Record<string, unknown>
try {
  mod = await import(distEntry)
}
catch (error) {
  fail(`dist/index.js failed to import: ${error instanceof Error ? error.message : error}`)
}

for (const name of ['collect', 'range', 'times', 'isCollection']) {
  if (typeof mod[name] !== 'function')
    fail(`expected dist/index.js to export function \`${name}\`, got ${typeof mod[name]}`)
}

const { collect, isCollection } = mod as unknown as typeof import('../src/index')

const numbers = collect([1, 2, 3])
if (!isCollection(numbers))
  fail('isCollection(collect([1, 2, 3])) returned false')

const sum = numbers.sum()
if (sum !== 6)
  fail(`collect([1, 2, 3]).sum() returned ${sum}, expected 6`)

console.log('smoke-dist: dist/index.js imports and works')
