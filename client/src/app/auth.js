define(["knockout", "jquery", "hasher"], function(ko, $, hasher) {
    function Auth(params) {
        var self = this;
        
        self.username = ko.observable('username');
        self.password = ko.observable('password');
    }
    
    $( document ).ajaxError(function(data) {
        console.log('ajax error');
        console.log(data);
        hasher.setHash('login');
    });
    return new Auth();
});