# Contributing to this Project
**Contributions are welcome :)**
**If you don't now how to code, simply open an issue.**

Checkout the [TODO list](https://github.com/OpenTransports/web-client/projects/1) to see the roadmap.

- Pick one a task
- Open a issue so I now you're working on it
- Make a pull request on the develop branch


# Development environment setup
Install [node](https://nodejs.org/en/download) and [yarn](https://yarnpkg.com/en/docs/install)

```shell
git clone https://github.com/OpenTransports/web-client  # Clone the repo
yarn                           # Install dependencies
yarn dev                       # Start the dev server on port 9000
```

You can setup some environment variables. To do this, copy the `.env.example` to `.env`.
`MOCK_SERVERS`: will replace the servers located in `src/reducers/serversList.json` with the given server. Usefull when you want to test a specific server or if you are running a server on your machine.
`MOCK_POSITION`: will mock the user position
`HTTPS`: will make the dev server to use https instead of http. Usefull when debugging on a mobile phone


# Architecture
The project uses react and redux so it tries to follow the good practices of thos frameworks.
`src/actions` contains action that can be dispatched
`src/reducers` contains the reducers that will update the store and the store initialisation
`src/containers` contains react components that use the store directly
`src/components` contains react components that receive their parameters from the containers  
`typings.d.ts` can be use to declare global typescript definitions


# Building
We use webpack to build the project


# Testing
We use jest to test the project.


# Release
Use `ỳarn release v<version number>`
Like `ỳarn release v1.0`
