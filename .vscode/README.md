# .vscode/
This directory contains default settings that may be freely overridden by contributors or tinkerers.
To inherit the settings, make a copy of the *.default file(s) and rename them, omitting the .default suffix.

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