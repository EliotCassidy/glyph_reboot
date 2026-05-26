# Glyph frontend

## TODO

### Performance

- compress the SVG e.g. SVGOMG
- Only load the fonts partially to render the global page so a user doesn't need to load every font in it's entirity to render the page
- Cache network requests e.g react-query or SWR

### Application stability

- Automated tests e.g. cypress
- Unit tests
- Convert to typescript
- Introduce a build pipeline, lint on build

### Translations

- Load languages dynamically, currently waiting till
- Make sure all error messages from the server are translated correctly

## How to run the front end application

### Setup

In order to work on our client, you need a current [NodeJS](https://nodejs.org/en/) version and also have [`yarn`](https://yarnpkg.com/) installed.
For NodeJS we recommend some kind of version manager ([volta](https://volta.sh/) and [NVM](https://github.com/nvm-sh/nvm) are the most popular alternatives)

### How to set up for the first time

1. Open your terminal
2. Clone this repository

```bash
git clone git@github.com:ykim22/glyph-fullstack.git
```

You may be prompted to type in your github username & password.

3. Navigate to the repo frontend folder

```bash
cd glyph-fullstack/frontend
```

Confirm your current location by typing in `pwd` in the terminal and you should see `/glyph-fullstack/frontend`

4. Download the dependancies using [yarn](https://yarnpkg.com/)

```bash
yarn install
```

5. Start the application locally

```bash
yarn start
```

A browser should open with the local version of the app at the location [http://localhost:3000/](http://localhost:3000/)

### Daily workflow

1. Navigate to the repo

```bash
cd glyph-fullstack/frontend
```

2. Make sure you are up to date with recent changes

```bash
git pull
```

3. Update dependancies

```bash
yarn
```

This may not be necessary but worth a check

4. Start the application locally

```bash
yarn start
```

A browser should open with the local version of the app

### How to stop the frontend application

1. Go to the terminal, and type in `control + c` on a mac (the `control` key is also the `^` looking key on the bottom left of the keyboard). Closing the terminal also works.

# Requirements

- Support 98% browsers
- Every characters should render in every browser,
- Pages should be responsive and functionality should work on mobile
