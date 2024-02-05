# IguaRPG 2
### Another computer game of the ages
This is another fangame of [Oddwarg Animal RPG](https://oddwarg.com/Games/OARPG/), a Game Maker game from 2003.

## Using the source code

### Prerequisites

- [**Node.js**](https://nodejs.org/en/download) (version 18 or above) to build and serve the project
- **npm** (included with Node.js) to download the open source dependencies
- [**Git LFS**](https://git-lfs.com/) to retrieve audio and image assets from the repository

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
You can play an extremely early version of the game. The most recent commit to this repository is hosted on Heroku.
At the time of writing this, the "game" is mostly a sandbox for testing a revamped game engine.

[Play alpha version on Heroku](https://igua-rpg2-d76be5c97e6f.herokuapp.com/)

**Note:** it may take several seconds for the Heroku app to load, as I have paid for the cheapest tier available.