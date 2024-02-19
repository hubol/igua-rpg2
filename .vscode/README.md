# .vscode/
This directory contains default settings that may be freely overridden by contributors or tinkerers.
To inherit the settings, make a copy of the .default.json file(s) and rename them, omitting the .default.

This document exists largely because the IDE would complain if I left comments in the .default files.
Everything is a rabbit hole. But that is usually part of the fun.

Relevant articles:
- Should I commit the .vscode folder to source control? https://stackoverflow.com/a/57749909
- IDEs complain about VSCode .json configuration files actually being JSONC https://github.com/microsoft/vscode/issues/189385

## settings.default.json
The primary motivation for configurations in **settings.default.json** is to ensure that VSCode uses an appropriate version of TypeScript for this project.
There is a bizarre PixiJS compilation error that I received when using the VSCode default TypeScript version of 5.0.4.

Relevant articles:
- Ensuring VSCode uses the workspace's TypeScript version https://stackoverflow.com/a/75357623
- Bizarre PixiJS compilation error https://github.com/pixijs/pixijs/issues/9747

## tasks.default.json
It can be nice to have the necessary build tasks start automatically when your IDE opens.
Another nicety of VSCode tasks is that their terminals are labeled with the task name.
The configurations in **tasks.default.json** start smooch and serve the app locally.
Note: these tasks will likely fail without setting up the repository appropriately (e.g. installing npm packages, pulling with Git LFS)

Relevant articles:
- Automating task to run on startup in VSCode https://sdivakarrajesh.medium.com/automating-task-to-run-on-startup-in-vscode-fe30d7f99454
- Custom tasks https://code.visualstudio.com/docs/editor/tasks#_custom-tasks