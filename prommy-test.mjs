import { initializeTs, transformFile } from './esbuild.prommy.mjs'

initializeTs();

// transformFile('C:/Users/hubol/Projects/igua-rpg2/src/igua/objects/obj-test.ts')
console.log(transformFile('C:/Users/hubol/Projects/igua-rpg2/src/igua/objects/obj-test.ts'))
// console.log(transformFile('C:/Users/hubol/Projects/igua-rpg2/src/igua/ui/iguana-designer/obj-ui-iguana-designer-root.ts'))
process.exit(0);