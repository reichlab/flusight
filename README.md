![icon](./icon.png)

Flusight is an influenza forecasts visualizer for the CDC FluSight Challenge.

Live at [https://reichlab.github.io/flusight/](https://reichlab.github.io/flusight/)

[![DOI](https://zenodo.org/badge/69420249.svg)](https://zenodo.org/badge/latestdoi/69420249)
[![Build Status](https://travis-ci.org/reichlab/flusight.svg?branch=master)](https://travis-ci.org/reichlab/flusight)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/reichlab/flusight.svg)](https://github.com/reichlab/flusight/pulls)

## Quickstart

For adding weekly submissions the recommended method is to create a pull request
on the master branch of this [repository](https://github.com/reichlab/flusight).
Fork this project and add your `.csv` files in `./data/` directory as described
in the project’s
workflow [wiki](https://github.com/reichlab/flusight/wiki/Workflow). The pull
requests will be automatically built and once merged to master, will be deployed
to the website.

## Deploying

Flusight works as a static webpage and needs a static hosting service (like
github’s). Building the project and bundling data files requires node.js, get
it [here](https://nodejs.org/en/download/).

+ Clone this repository

  `git clone git@github.com:reichlab/flusight.git && cd ./flusight`

+ Install dependencies (you only need to run this when first installing the app)

  `npm i -g yarn`

  `yarn`
  
+ Put prediction submission files in `./data`

+ Parse prediction files

  `yarn run parse`
  
+ Bundle production build

  `yarn run build`

+ Run/test the app locally

  `yarn run dev`

+ Host. Copy over contents from `./dist` to your hosting service.

+ Alternatively, a quick deploy to github pages can be done by running
  
  `yarn run deploy`
  
  *Remember to point git remote origin to the repository where you want the
  deployment to take place*

## Development

> On github, commits to `master` are automatically built and deployed to
> `gh-pages` with travis. `master` contains most recent *working* version.
> `develop` contains the latest commits.

``` shell
# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build
```
