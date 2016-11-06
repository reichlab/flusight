![icon](./icon.png)

Flusight is an influenza forecasts visualizer for the CDC FluSight Challenge.

Live at [https://reichlab.github.io/flusight/](https://reichlab.github.io/flusight/)

## Quickstart

For adding weekly submissions for visualization the recommended method is to
create a pull request on the
project’s [github page](https://github.com/reichlab/flusight) (this will lead to
automated rebuilds, eventually). Add your `.csv` files in `./data/` directory as
described in the project’s
workflow [wiki](https://github.com/reichlab/flusight/wiki/Workflow).

## Deploying

Flusight works as a static webpage and needs a static hosting (like github’s).
Building the project and bundling data files
requires node.js, get it [here](https://nodejs.org/en/download/).

+ Clone this repository

  `git clone git@github.com:reichlab/flusight.git && cd ./flusight`

+ Install dependencies

  `npm install`
  
+ Put prediction submission files in `./data`

+ Parse prediction files

  `npm run parse`
  
+ Bundle production build

  `npm run build`

+ Host. Copy over contents from `./dist` to your hosting service.

+ Alternatively, a quick deploy to github pages can be done by running
  
  `npm run deploy`
  
  *Remember to point git remote origin to the repository where you want the
  deployment to take place*

## Developing

Read the development
doc [here](https://github.com/reichlab/flusight/wiki/Development)
