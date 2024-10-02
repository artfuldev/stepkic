# stepkic

A simple UI for playing tic-tac-toe that supports
[ST3P](https://gist.github.com/artfuldev/47ef277cf4bbbfdf0eed4750b8821c8c)
engines.

## Getting Started

This project uses `nvm` and `yarn`. After installing `nvm`:

```sh
nvm install
nvm use
npm i -g yarn
yarn
```

should be enough to install the dependencies. To run the app locally, use

```sh
yarn start
```

To run in a lower MSVN (current is 2)

```sh
yarn start -- -- --msvn=1
```

One set of `--` is for yarn to pass through the remaininng arguments, and we
need another set of `--` for `electron-forge` to do the same, and the app checks
for `--msvn=` command switch.
