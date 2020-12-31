# BundleTracker

BundleTracker is a webpack plugin that uploads stats about your bundles to a backend service.

This service returns an URL, such as:

```
https://app.bundletracker.io/4053a737-552a-415c-8b70-a70a208ddc90
```

which opens to this:

![BundleTracker Demo](https://bundletracker.io/files/demo.gif)

Add it to your CI pipeline and have an instant x-ray into your deployed code.

Use the communal app.bundletracker.io server, where links expire in 7 days, or self-host your own.

# Current status

- Add webpack stats to `assets/stats.json` and run `yarn start` to see a treemap.
- That's it. What follows is how it should work.


# Installing the plugin (not yet though)

```sh
yarn add @bundletracker/plugin
npm install --save-dev @bundletracker/plugin
```

```js
// webpack.config.js
const BundleTrackerPlugin = require('@bundletracker/plugin')

module.exports = {
    ...,
    plugins: [
        new BundleTrackerPlugin({
            // host: 'https://app.bundletracker.io',
            // sendStats: process.env.NODE_ENV == 'production',
        }),
    ],
}
```

# Installing the server (also not yet)

```sh
npm install -g @bundletracker/server

export SITE_URL=http://localhost:3000
export PORT=3000
export DATABASE_URL=postgres://localhost/bundletracker

bundletracker-server
```

You can pass config either via env (`DATABASE_URL`) or cli arguments (`--database-url`).

# Future plans

- Track changes in your bundles over time
