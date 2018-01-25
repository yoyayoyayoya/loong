# Long

Loong is a simple state management lib. It could helps you manage your state based on models and Pub/Sub pattern.

[![Build Status](https://travis-ci.org/yoyayoyayoya/loong.svg?branch=master)](https://travis-ci.org/yoyayoyayoya/loong)
[![codecov](https://codecov.io/gh/yoyayoyayoya/loong/branch/master/graph/badge.svg)](https://codecov.io/gh/yoyayoyayoya/loong)
[![npm](https://img.shields.io/npm/dm/loong.svg)](https://www.npmjs.com/package/loong)
[![npm](https://img.shields.io/npm/dt/loong.svg)](https://www.npmjs.com/package/loong)
[![npm](https://img.shields.io/npm/l/loong.svg)]()
[![npm](https://img.shields.io/npm/v/npm.svg)]()

## Introduces

Althought there are so many state management libs such as Redux, Flex, Mobox and so on. You will find lots of them are not focus on model strongly.

The model in MV\* pattern is a very important factor actually. We rely on it to provide the business data services, expect it to handle the business logic. I have been asking myself about why the developments of MV\* still is a diffcult task even if we have the smart frameworks(React, Vue...). WHY? You may got the answer to it or not. I got it of my own. Just like I said above. We are ignoring and missing the model in it. So I am trying to change it and create the new state management lib **Loong**.

It is a Redux alike lib followd the flex pattern. The different part is it based on _Model_ insteading of reducers. The _Model_ will give you a clearer picture of your state. Comparing to pure reducer fuction. The _Model_ also has the predictable, testable features.

## Conecpts

* [Pub/Sub pattern](#Pub/Sub pattern)
* [Event](#Event)
* [Model](#Model)

### Pub/Sub pattern

### Event

### Model

## How to Use it

Currently I implemented the tool for React [React-loong](https://github.com/yoyayoyayoya/react-loong).

### Install

```bash
> npm install --save loong react-loong
or
> yarn add loong react-loong
```

### Example

[TodoMvc](https://github.com/yoyayoyayoya/loong/tree/master/examples/todomvc)
