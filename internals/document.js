const isProduction = process.env.NODE_ENV === 'production';

module.exports = (state = null, manifest = null) => `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1, initial-scale=1, user-scalable=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta httpEquiv="x-ua-compatible" content="IE=edge" />

      <title>React Video App</title>
      <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800" rel="stylesheet">
      ${insertStyles(manifest)}
    </head>
    <body>
      <div id="app" />
      ${insertState(state)}
      <script src=${manifest ? manifest['vendor.js'] : '/public/vendor.js'}></script>
      <script src=${manifest ? manifest['app.js'] : '/public/app.js'}></script>
    </body>
  </html>`;

const insertStyles = manifest => (
  isProduction ? `<link href=${manifest['vendor.css']} rel="stylesheet" type="text/css" />` : ''
);

const insertState = state => (
  state ? `<script>window.__initial_state__ = ${JSON.stringify(state)}</script>` : ''
);
