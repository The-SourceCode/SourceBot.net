# SourceBot Website
<div align="center">
<img src="https://i.imgur.com/qwt4PFB.png" align="center" alt="Logo">
<br><br>
<strong><i>An Open-Source project from TheSourceCode</i></strong>
<br><br>
<a href="https://discord.gg/jkAzNyB"> <img src="https://img.shields.io/discord/265499275088232448.svg?colorB=Blue&logo=discord&label=Support&style=for-the-badge" alt="Support"></a><br>
</div>

***

# Info 📍
Welcome to the official SourceBot's website where you can check user's *rank, levels, exp, etc*.

This project is open source, so you can help us improve the website and issues that you might encounter.

# Contributing 📝
**For Developers:** If you see any errors and you know how to fix it or you want to add a new feature, check the installation and setup section bellow.\
**For Non-Developers:** If you see an error make sure you let us know in the *[issues](https://github.com/The-SourceCode/sourcebot.net/issues/new)* section.

## Installation & Setup
You need to have the following:
* [Node/NPM](https://nodejs.org/en/ 'download nodejs')
* [Mongo](https://www.mongodb.com/cloud/atlas 'Get a free db') database
* [Discord](https://discordapp.com/developers/applications/ 'Create a Bot app') bot token


* [Jade/Pug](https://pugjs.org/api/getting-started.html) knowledge
* [Express](https://expressjs.com/) knowledge
* [Mongoose](https://mongoosejs.com/) knowledge

Then you must do the following:
* Fork and clone the repository
* Clone the `config.example.js` file and rename it to `config.js` and fill out the credentials.
* `npm run install` (To get all the dependencies.)
* Create a branch for your feature/fix.
  * To make any new *features* you must create a separate branch named `feature/<feature-name>`.
  * For making any *fixes*, it's more of the same thing, the branch should be named `fix/<fix-name>`
* `npm start` (And check if there are any errors)
  * If you want the website to restart/reload with the changes you made use `npm run watch` instead. (You must have [PM2](https://pm2.io/runtime/ 'Install PM2'))
* Push the new branch to your fork `git push origin feature/foobar`
* Make a pull request [here](https://github.com/The-SourceCode/SourceBot.net/compare 'Make pull request').

Check our [Trello](https://trello.com/b/Ix5E9Fcj/sourcebotwebsite) board to keep you updated of the changes being made.\
Thank you for your contributions.