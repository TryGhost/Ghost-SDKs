# Social Urls

## Install

`npm install @tryghost/social-urls --save`

or

`yarn add @tryghost/social-urls`


## Usage

```js
const {twitter: makeTwitter, facebook: makeFacebook} = require('@tryghost/social-urls');

const socialUrls = [
    makeTwitter('@ghost'), // https://twitter.com/ghost
    makeFacebook('/ghost') // https://facebook.com/ghost
];
```

## Develop

This is a mono repository, managed with [lerna](https://lernajs.io/).

Follow the instructions for the top-level repo.
1. `git clone` this repo & `cd` into it as usual
2. Run `yarn` to install top-level dependencies.


## Run

- `yarn dev`


## Test

- `yarn lint` run just eslint
- `yarn test` run lint and tests




# Copyright & License

Copyright (c) 2013-2021 Ghost Foundation - Released under the [MIT license](LICENSE).
