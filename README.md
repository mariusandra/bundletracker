# BundleTracker

BundleTracker is a webpack plugin that uploads stats about your bundles to a backend service.

This service returns an URL, such as:

```
https://app.bundletracker.io/4053a737-552a-415c-8b70-a70a208ddc90
```

which opens to this:

![BundleTracker Demo](https://user-images.githubusercontent.com/53387/103389630-4985d680-4b10-11eb-8c5d-4afc56e554be.gif)

Add it to your CI pipeline and have an instant x-ray into your deployed code.

Use the communal app.bundletracker.io server, where links expire in 7 days, or self-host your own.

# Installing the plugin

```sh
yarn add @bundletracker/plugin
npm install --save-dev @bundletracker/plugin
```

```js
// webpack.config.js
const { BundleTrackerPlugin } = require('@bundletracker/plugin')

module.exports = {
    ...,
    plugins: [
        new BundleTrackerPlugin({
            // uploadStats: process.env.NODE_ENV === 'production',
            // host: 'https://app.bundletracker.io',
        }),
    ],
}
```

Build your bundle as you normally would and visit the emitted URL to see inside:

```sh
$ yarn webpack:build
📦 Bundle Tracked: http://localhost:4001/b/ckjd1itea0022jsv0fftmls7l
```

# Installing the server

Install the package:

```sh
npm install -g @bundletracker/server
```

Configure your environment:

```sh
export SITE_URL=http://localhost:4001
export PORT=4001
export DATABASE_URL=postgres://localhost/bundletracker
```

Run the server

```sh
$ bundletracker-server

🟢 6 bundles in the database!
🟢 BundleTracker Server listening at http://localhost:4001
```

# Future plans

- Track changes in your bundles over time
