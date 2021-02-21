# BundleTracker

BundleTracker is a webpack plugin that uploads stats about your bundles to a backend service.

This service returns an URL, such as:

[`https://app.bundletracker.io/b/nNvYVNSdvztajddgGhaadomuB7okP2gL7OrdIydZ`](https://app.bundletracker.io/b/nNvYVNSdvztajddgGhaadomuB7okP2gL7OrdIydZ)

which opens to this:

![BundleTracker Demo](https://user-images.githubusercontent.com/53387/103489877-01202e80-4e18-11eb-8c6a-508e23934eba.gif)

Add it to your CI pipeline and have an instant x-ray into your deployed code.

Use the communal `app.bundletracker.io` server, where links expire in 14 days, or self-host your own.

# Installing the plugin

```sh
# with yarn
yarn add --dev @bundletracker/plugin

# with npm
npm install --save-dev @bundletracker/plugin
```

```js
// webpack.config.js
const { BundleTrackerPlugin } = require('@bundletracker/plugin')

module.exports = {
    ...,
    plugins: [
        new BundleTrackerPlugin({
            // upload only when this is true:
            upload: process.env.NODE_ENV === 'production',
            host: 'https://app.bundletracker.io',
            // token: 'optional project token', 
            // commit: process.env.GITHUB_SHA,
            // branch: process.env.GITHUB_REF?.split('/').splice(2).join('/')
            // afterUpload: (url) => { console.log(`📦 Bundle Tracked: ${url}`) }
        }),
    ],
}
```

Build your bundle as you normally would and visit the emitted URL to see inside:

```sh
$ yarn webpack:build
📦 Bundle Tracked: https://app.bundletracker.io/b/nNvYVNSdvztajddgGhaadomuB7okP2gL7OrdIydZ
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

## Project Tokens

You can group uploaded bundles into projects. To generate a new project and get a token, run the following:

```sh
$ bundletracker-server new project "Project Name"

🏁 Project "Project Name" created!
🔑 Use this token to upload bundles: FruKK2wTL8ybGCSl452ZzqhXjVNm4B1Q3WTQlrPG
```

Project support is still raw. You can link bundles to a project, but you can't see a combined list of bundles in a project.

# Future plans

BundleTracker is in a really early state. Some of the next planned things include:

- List all bundles in a project
- Track changes in your bundles in a project over time
- Make the \*OTHER\* box clickable
- Show minified/gzipped sizes
