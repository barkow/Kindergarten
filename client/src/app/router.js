define(["knockout", "crossroads", "hasher"], function(ko, crossroads, hasher) {

    // This module configures crossroads.js, a routing library. If you prefer, you
    // can use any other routing library (or none at all) as Knockout is designed to
    // compose cleanly with external libraries.
    //
    // You *don't* have to follow the pattern established here (each route entry
    // specifies a 'page', which is a Knockout component) - there's nothing built into
    // Knockout that requires or even knows about this technique. It's just one of
    // many possible ways of setting up client-side routes.

    return new Router({
        routes: [
            { url: '',                                                      params: { page: 'home-page' } },
            { url: 'familydetails/:familyId:',                              params: { page: 'family-details-page' } },
            { url: 'familydetails/:familyId:/childdetails/:childId:',       params: { page: 'child-details-page' } },
            { url: 'familydetails/:familyId:/contactdetails/:contactId:',   params: { page: 'contact-details-page' } },
            { url: 'families',                                              params: { page: 'families-page' } },
            { url: 'taglist',                                               params: { page: 'taglist-page' } },
            { url: 'login',                                                 params: { page: 'login-page' } },
            { url: 'about',                                                 params: { page: 'about-page' } }
        ]
    });

    function Router(config) {
        var currentRoute = this.currentRoute = ko.observable({});
        var oldRoute = this.oldRoute = ko.observable();

        ko.utils.arrayForEach(config.routes, function(route) {
            crossroads.addRoute(route.url, function(requestParams) {
                currentRoute(ko.utils.extend(requestParams, route.params));
            });
        });

        activateCrossroads(this.oldRoute);
        
        function storeOldRoute(newHash, oldHash){
          this.oldRoute = oldHash;
        };
        hasher.changed.add(storeOldRoute);
    }

    function activateCrossroads(oldRoute) {
        function parseHash(newHash, oldHash) { oldRoute(oldHash); crossroads.parse(newHash); }
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
        hasher.initialized.add(parseHash);
        hasher.changed.add(parseHash);
        hasher.init();
    }
});