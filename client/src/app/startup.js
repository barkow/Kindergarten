define(['jquery', 'knockout', './router', './auth','bootstrap', 'knockout-projections','select2-ko-binding'], function($, ko, router, auth) {

  // Components can be packaged as AMD modules, such as the following:
  ko.components.register('nav-bar', { require: 'components/nav-bar/nav-bar' });
  ko.components.register('home-page', { require: 'components/home-page/home' });

  // ... or for template-only components, you can just point to a .html file directly:
  ko.components.register('about-page', {
    template: { require: 'text!components/about-page/about.html' }
  });
  
  ko.components.register('family-details-page', { require: 'components/family-details-page/family-details-page' });
  
  ko.components.register('child-details-page', { require: 'components/child-details-page/child-details-page' });
  
  ko.components.register('families-page', { require: 'components/families-page/families-page' });
  
  ko.components.register('confirm-modal', { require: 'components/confirm-modal/confirm-modal' });
  
  ko.components.register('taglist-page', { require: 'components/taglist-page/taglist-page' });
  
  ko.components.register('contact-details-page', { require: 'components/contact-details-page/contact-details-page' });
  
  ko.components.register('login-page', { require: 'components/login-page/login-page' });
  
  ko.components.register('next-birthdays-element', { require: 'components/next-birthdays-element/next-birthdays-element' });
  
  ko.components.register('lunch-page', { require: 'components/lunch-page/lunch-page' });
  
  // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

  // Start the application
  ko.applyBindings({ route: router.currentRoute, oldRoute: router.oldRoute, authData: auth });
});
