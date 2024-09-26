# /src
This document outlines general conventions to consider when writing code for this project.

## kebab-case?
It looked cute but I might regret it now. I'm not sure...

## Game Objects
Game Objects are PixiJS `DisplayObject`s enriched with behavior. They are created using functions:
```ts
export function objPlayer() {
    const p = new Graphics().drawRect(0, 0, 16, 16)
        .step(() => {
            if (Input.justWentDown("MoveRight")) {
                p.x += 1;
            }
        });

    return p;
}
```

### Name
Use a function with a **camelCase** name prefixed **obj**.

If defining a type for a Game Object, use a **PascalCase** name prefixed **Obj**:
```ts
export type ObjPlayer = ReturnType<typeof objPlayer>;
```

Recommendation: If storing a reference to a Game Object, use a **camelCase** name postfixed **Obj**:
```ts
const playerObj = objPlayer();
```

### Organization
If a module's primary intent is to export a Game Object, the file should have a name prefixed **obj-**.


## Scenes
Scenes are functions that are called when the `IguaSceneStack` is modified.
Scenes can place Game Objects on one or more of the current "stages". Scenes may also configure Global Services e.g. to play music or set the background color.
They are somewhat of an analog to Game Maker's "Room" concept.

### Name
Use a function with a **camelCase** name prefixed **scn**.

### Organization
Place the module exporting the Scene in the **igua/scenes/** directory. The file should have a name prefixed **scn-**.


## Global Services
Game Objects and Scenes in this engine frequently access and manipulate Services that were not explicitly passed as dependencies.
This enables writing more terse code.

Orthodoxy would have you believe this is poor practice, but it is perfectly manageable for a seasoned developer.

### Name
Use **PascalCase**. However, there are already some exceptions for historical reasons.

### Organization
Can be found anywhere.


## Factory functions
Functions that create resources other than Game Objects.

### Name
Use a function with a **camelCase** name prefixed **create**.

### Organization
If a module's primary intent is to export a Factory function, the file name can be the **kebab-case** function name *omitting* the **create** prefix e.g.
```ts
// animal.ts
export function createAnimal() { }

// debug-panel.ts
export function createDebugPanel() { }
```


## Classes
For some systems, it feels more natural to use classes. There is no ban on using classes or any typical OOP features e.g. `abstract`, `protected`, and `private` modifiers.

## Formatting
I am using `dprint` for formatting. `prettier` is too opinionated and `ESLint` has an embarrassing footprint.