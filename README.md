# IguaRPG 2
### Another computer game of the ages
This is another fangame of [Oddwarg Animal RPG](http://oddwarg.com/index.php?id=OARPG), a Game Maker game from 2003.

## Using the source code
This is a modern web project. You will need `node` and `npm` to continue.

You will need the Git LFS extension to correctly pull the project's asset files.

Certain asset and source code files are generated using `@hubol/smooch`.

### Getting started

```npm ci```

Installs the dependencies of the project *exactly* as specified in `package-lock.json`

```npm run tool -- dev-patch-pixi-displayobject-ctor```

Patches some PixiJS code so that stack traces can be collected during development

### Developing

```npx smooch```

Starts `@hubol/smooch`, the tool responsible for monitoring binary assets and turning them into source code

```npm run serve```

Starts the project in development mode

## Play an alpha?!
You can play an extremely early version of the game. The most recent commit to the `main` branch of this repository is hosted on Heroku.
At the time of writing this, the "game" is mostly a sandbox for testing a revamped game engine.

[Play alpha version on Heroku](https://igua-rpg2-d76be5c97e6f.herokuapp.com/)

## License
This repository is publicly available as a curiosity and learning tool. When using the source code or assets you must credit me publicly. You may not create commercial works using the source code or assets without my explicit permission.
