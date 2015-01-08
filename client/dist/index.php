<?php
if (!isset($_SERVER['PHP_AUTH_USER'])) {
    //header('WWW-Authenticate: Basic realm="My Realm"');
    //header('HTTP/1.0 401 Unauthorized');
    //echo 'Text, der gesendet wird, falls der Benutzer auf Abbrechen drückt';
    //exit;
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Für uns Pänz</title>
    <link rel="stylesheet" href="css.css">
    <script src="scripts.js"></script>
  </head>
  <body>
    <?php if (true || !isset($_SERVER['PHP_AUTH_USER'])): ?>
    <nav-bar params="route: route"></nav-bar>
    <div id="page" class="container" data-bind="component: { name: route().page, params: {route: route(), oldroute: oldRoute(), auth: authData } }"></div>
    <?php else: ?>
    <div id="page" class="container" data-bind="component: { name: 'login-page', params: {route: route(), oldroute: oldRoute() } }"></div>
    <?php endif; ?>
  </body>
</html>
