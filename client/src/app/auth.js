define(["knockout", "jquery", "hasher"], function(ko, $, hasher) {
    function Auth(params) {
        var self = this;
        
        self.username = ko.observable('axel.barkow');
        self.password = ko.observable('pass');
        
        $( document ).ajaxSend(function(event, jqxhr, settings) {
            jqxhr.setRequestHeader('Authorization', "Basic " + btoa(self.username() + ":" + self.password()));
        });
    }
    
    $( document ).ajaxError(function(jqXHR, textStatus, errorThrown) {
        //Wenn Auth Fehler, dann auf Login Seite umleiten
        if (textStatus.status == 403){
            hasher.setHash('login');
        }
    });
    
    return new Auth();
});