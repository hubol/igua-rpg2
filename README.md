# IguaRPG 2
### Another computer game of the ages
This is another fangame of [Oddwarg Animal RPG](http://oddwarg.com/index.php?id=OARPG), a Game Maker game from 2003.

## Using the source code
This is a modern web project. You will need `node` and `npm` to continue.

You will need the Git LFS extension to correctly pull the project's asset files.

Certain asset and source code files are generated using `@hubol/smooch`.

## Play an alpha?!
You can play an extremely early version of the game. The most recent commit to the `main` branch of this repository is hosted on Heroku.
At the time of writing this, the "game" is mostly a sandbox for testing a revamped game engine.

<style>
    #play_alpha {
        --color: #9858B0;
        --text-color: white;
        background-color: var(--color);
        color: var(--text-color);
        border: solid 0.25em var(--color);
        padding: 0.3em 0.5em;
        border-radius: 4px;
        cursor: pointer;
        font-size: 150%;
        transition: background-color 0.2s, color 0.2s;
        text-decoration: none;
    }

    #play_alpha:hover, #play_alpha:focus {
        background-color: #00000000;
        --text-color: var(--color);
    }

    #play_alpha svg {
        display: inline;
        height: 0.8em;
        margin-left: 0.2em;
    }

    #play_alpha svg polygon {
        fill: var(--text-color);
        stroke: var(--text-color);
        transition: fill 0.2s, stroke 0.2s;
    }
</style>
<a id="play_alpha" href="https://igua-rpg2-d76be5c97e6f.herokuapp.com/" target="_blank">
    Play Alpha
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.9 11.2">
        <polygon class="cls-1" points=".5 .5 .5 10.7 7.4 5.6 .5 .5"></polygon>
    </svg>
</a>

## License
This repository is publicly available as a curiosity and learning tool. When using the source code or assets you must credit me publicly. You may not create commercial works using the source code or assets without my explicit permission.
