<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Für uns Pänz</title>
    <!-- build:css -->
      <link href="bower_modules/components-bootstrap/css/bootstrap.min.css" rel="stylesheet">
      <link href="css/styles.css" rel="stylesheet">
      <link href="bower_modules/select2/select2.css" rel="stylesheet">
      <link href="bower_modules/select2/select2-bootstrap.css" rel="stylesheet">
    <!-- endbuild -->
    <!-- build:js -->
      <script src="app/require.config.js"></script>
      <script data-main="app/startup" src="bower_modules/requirejs/require.js"></script>
    <!-- endbuild -->
  </head>
  <body>
    <nav-bar params="route: route"></nav-bar>
    <div id="page" class="container" data-bind="component: { name: route().page, params: {route: route(), oldroute: oldRoute() } }"></div>
  </body>
</html>
