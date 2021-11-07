# discord-hsbot

[![test](https://github.com/wasuwasu/discord-hsbot/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/wasuwasu/discord-hsbot/actions/workflows/ci.yml)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/wasuwasu/discord-hsbot)

## Description
For private discord server, hobby use multi functional bot.

# Feature list
- Push talk to Google home by slash commands.

## Script

### start

```
npm run compile && npm start
```

### start:dev

ts-nodeを使って実行します。(コンパイル不要)

```bash
npm run start:dev
```

### compile

コンパイルします。

```bash
npm run compile
```

### compile:test

コンパイルします。(ファイルを出力しない)

```bash
npm run compile:test
```

### lint

静的検証ツール(ESLint)を使って問題を調べる。

```bash
npm run lint
```

### lint:fix

問題を修正する。

```bash
npm run lint:fix
```
