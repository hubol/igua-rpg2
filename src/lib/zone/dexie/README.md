Adapted from https://github.com/vlcn-io/model/
https://github.com/vlcn-io/model/blob/7d3850fc5d1f0b2ed52d721edb898fccc21cb90f/ts/packages/zone/src/index.ts
an alternative to zone.js that I found from this stackoverflow answer: https://stackoverflow.com/questions/66960129/something-like-async-hooks-for-the-browser/75621061#75621061
An advantage might be that it seems to support native Promises--which zone.js does not!

Rev. 1
Remove unused exports from the `Dexie.js` modules.

Rev. 2
Convert all modules to TypeScript.

Rev. 3
Merge all modules into one.

------------------------

Set of files lifted from `Dexie.js` to enable async context propagation.

Initially tried `zone.js` but that does not work with native `async & await`. See commit: https://github.com/aphrodite-sh/acid-memory/commit/fef0d84765dadd26920fc91bb1ac3ed443c59840
