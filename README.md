# Disclaimer

*`ng2workspace` is still work in progress, was created for personal use, and has 
almost no documentation to go with it.*

*Feel free to check out the [`sample app`](https://github.com/ng2workspace/ng2workspace-sample-app)
for some idea of how it can be used. I will provide documentation once the
project has matured enough for me to be able to provide an accurate usage guide.*

# Purpose

The purpose of `ng2workspace` is to create a modular workspace for Angular 2
development. Here are some of its goals, to name a few:

- make it simpler to share the same build system across multiple projects
- allow for simple adding/removing of build features (e.g. drop CSS, pick up Sass)
- allow project build systems to be maintained independently of the projects
themselves
- hide away some of the ugliness in build configurations (e.g. enabling inline 
mode when using webpack with Gulp)

`ng2workspace` and its [family of packages](https://github.com/ng2workspace)
were originally created based on the great work of the folks at 
[AngularClass](https://github.com/AngularClass) in their 
[`angular2-webpack-starter`](https://github.com/AngularClass/angular2-webpack-starter).
The main source of [`ng2workspace-sample-app`](https://github.com/ng2workspace/ng2workspace-sample-app) 
has been copied directly from [`angular2-webpack-starter`](https://github.com/AngularClass/angular2-webpack-starter). 


## Installation

First install `ng2workspace` via `npm` and save it to your dev dependencies:

```
npm install ng2workspace --save-dev
```

Then, copy the list of `peerDependencies` from the project's [`package.json`](package.json)
into your own project's `dependencies` list. For early Beta versions of Angular,
`ng2workspace` lists exact versions as its peer dependencies, to help you avoid
incompatible packages. Later, once Angular 2 and its dependencies have stabilised
a little more, `ng2workspace` will loosen the version numbers in its dependencies.

## Sample App

Take a look at the [`ng2workspace-sample-app`](https://github.com/ng2workspace/ng2workspace-sample-app)
project for an example of a build system based on 
[`angular2-webpack-starter`](https://github.com/AngularClass/angular2-webpack-starter).
