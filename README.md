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


# Installing the plugin

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
            // host: 'https://app.bundletracker.io'
        })
    ]
}
```

# Installing the server

```sh
npm install -g @bundletracker/server

export SITE_URL=http://localhost:3000
export PORT=3000
export DATABASE_URL=postgres://localhost/bundletracker
bundletracker-server
```

Pass the database either via the `DATABASE_URL` env or the `--database-url` flag.
