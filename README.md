Health and Safety
-----------------

![mindmap](https://raw.githubusercontent.com/gamemash/health-and-safety/master/documentation/mindmap.png "mindmap")


Building and Developing
-----------------------

You will need to have node installed, which should give you NPM.
Then install browserify and budo:

```
npm install -g browserify
npm install -g budo
```

Now you can type `make` to build the project.
You can also type `make develop` to auto build the project as you code.
The browser will open for you, and refresh as you change files.


Sprint 0
--------

Gamepad controlled character in the center of the screen

  - Gamepad library
  - Rendering of a animated sprite
  - Center of gravity camera
  - Game world

Sprint 1
--------

  - World editor

  - Collision detection

Sprint 2
--------

  - Enemies & Combat

Backlog
-------

  - Starting zone that introduces a game mechanic

  - Multiplayer
    - Note passing
      - players can drop a note on the world that other players can read

    - Follow bloodborne model of multiplayer
      - Request for help
      - Available for help
      - Set password

    - Try to use firebase for coordination of requests/availables and notes in the gameworld
    - Use a node.js websocket server




Ongoing things to think about and define:
-----------------------------------------

  - Story
  - graphics
  - character abilities
  - items


References
------------------------------------------

Gamepad API
  - https://w3c.github.io/gamepad/
  - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API