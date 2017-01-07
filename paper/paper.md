---
title: 'flusight: A static influenza forecast visualizer'
tags:
  - Data Visualization
  - Influenza Forecasts
authors:
affiliations:
date: 07 January 2017
bibliography: paper.bib
---

# Summary

Flusight is a static influenza forecasts visualizer. It provides an interactive
interface for comparison and exploration of influenza forecast models over time
and regions. A version is live [here](https://reichlab.github.io/flusight/).

Flusight uses D3 [@d3] for generating visualizations from a single static file
summarizing the entities to be visualized. It is written to keep hosting
overhead minimal and works by pre-generating the data file by parsing model
predictions and live influenza data from delphi-API [@delphi_api] and bundling
everything in form of a static web page. The data collection step can be
replaced to visualize forecasts from custom sources instead of the ones used in
the repository, allowing users to plug in similar time series based disease
prediction models for visualization.

![screenshot](screenframe.png)

# References
