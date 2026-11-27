import { expect, test } from 'bun:test'
import manifest from '../package.json'

test('consumer installation does not run contributor Git hooks', () => {
  const installPhases = ['preinstall', 'install', 'postinstall', 'prepare']
  const hookCommands = Object.entries(manifest.scripts).filter(([phase, command]) =>
    installPhases.includes(phase) && /\b(?:bun-)?git-hooks\b/.test(command),
  )

  expect(hookCommands).toEqual([])
})
