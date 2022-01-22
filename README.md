# king-bot-api <!-- omit in toc -->

this is a really high performance based bot for [travian kingdoms](https://www.kingdoms.com/) written in typescript.  
it's designed to run in a console for better server support.

[![Build Status](https://travis-ci.com/pkeweloh/king-bot-api.svg?branch=master)](https://travis-ci.com/pkeweloh/king-bot-api)
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/pkeweloh/king-bot-api/blob/master/LICENSE)

# table of contents <!-- omit in toc -->

- [getting-started](#getting-started)
- [gui](#gui)
  - [features](#features)
  - [screenshots](#screenshots)
- [docker](#docker)
- [development](#development)
- [thank you for](#thank-you-for)
- [contact](#contact)

# getting-started

1. go to releases tab: [click here](https://github.com/breuerfelix/king-bot-api/releases)
2. download the correct version for your distribution
3. execute `king-bot-api` or `king-bot-api.exe`

**or**

[use docker](#docker)

**or**

1. install latest version of [nodeJS](https://nodejs.org/)
2. clone or download this repository
3. open project in console
4. install all dependencies
    1. `$ npm install`
5. build the project
    1. `$ npm run build`
6. edit `main.js`
    1. look up `sample_main.js` for help
7. start the bot
    1. `$ npm start`

after changing `main.js` only use `$ npm start` to restart the bot.  
when downloading a new project version you have to `$ npm install && npm run build` again before starting the bot.

# gui

1.  provide your login credentials in `main.js`.
1.  `$ npm start`
1.  open `http://localhost:3000/` in your browser and explore the bot

after configuring you can close the browser window and the bot keeps running until you exit it in the console (CTRL + C).

## features

-   login as normal player, dual or sitter
-   send farmlist in interval
-   endless building queue
-   auto raise fields
-   auto adventure
-   finish 5 min earlier
-   inactive finder
-   easy scout
-   custom trade routes
-   timed send
-   train troops
-   robber hideouts
-   available in different languages
-   proxy support

## screenshots

![interface](https://breuer.dev/assets/king-bot-api/home.png)  
![farming](https://breuer.dev/assets/king-bot-api/farmlist.png)

# docker

there is also a docker image for this bot.  
create a folder for the database and a file (`cred.txt`) with your credentials in this folder that can be mounted to the docker container.  
`sitter_type` could be 'sitter' or 'dual'. `sitter_name` should be the ingame avatar nickname of the target gameworld.  
sitter information is optional.  
proxy is also optional and has to be in the second line if present.

```csv
your_email;your_password;your_gameworld;sitter_type;sitter_name
http://username:password@yourproxy:port
```

pull image and start the container mounting the file:

```console
$ docker pull scriptworld/king-bot-api
$ sudo bash ./docker.sh
```
the docker script will prompt you for a container name, what port you want the bot to run on and the absoulute path to the folder you just created.

visit `http://localhost:3000` (or whatever port you chose) to see the results.

# development

if you wanna use the command `npm run dev` or `npm run watch` you need to insert your credentials into `dev_main.js`.  
you can also create a file names `cred.txt` in the root folder which contains your login credentials:

```csv
your_email@mail.com;your_password;your_gameworld
http://proxy:inthe@secondlineis:optional
```

this file will be ignored by git so you don't have to be scared to accidentally commit your credentials.

create a file names `own_main.js` which is going to be ignore by git, you can modify it as you wish, without pushing your custom feature set to github.

# thank you for

created the project and developed the whole thing **[@breuerfelix](https://github.com/breuerfelix)**  
beeing active since the first day of this project **[@didadadida93](https://github.com/didadadida93)**  
keeping the issue page alive **[@OneManDevz](https://github.com/OneManDevz)**  
programming auto adventure **[@Tom-Boyd](https://github.com/Tom-Boyd)**  
programming trade routes / timed attack **[@tmfoltz](https://github.com/tmfoltz)**  

---

_we love lowercase_
