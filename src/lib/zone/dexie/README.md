Adapted from https://github.com/vlcn-io/model/
an alternative to zone.js that I found from this stackoverflow answer: https://stackoverflow.com/questions/66960129/something-like-async-hooks-for-the-browser/75621061#75621061
An advantage might be that it seems to support native Promises--which zone.js does not!

Rev. 1
Remove unused exports from the `Dexie.js` modules.

Rev. 2
Convert all modules to TypeScript.

------------------------

Set of files lifted from `Dexie.js` to enable async context propagation.

Initially tried `zone.js` but that does not work with native `async & await`. See commit: https://github.com/aphrodite-sh/acid-memory/commit/fef0d84765dadd26920fc91bb1ac3ed443c59840
