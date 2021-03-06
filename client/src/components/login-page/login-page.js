define(['knockout', 'text!./login-page.html', 'hasher'], function(ko, templateMarkup, hasher) {

  function LoginPage(params) {
    var self = this;
    self.username  = params.auth.username;
    self.password = params.auth.password;
    
    self.loginClick = function(){
      console.log(params); 
      if (params.oldRoute){
        hasher.setHash(params.oldRoute);
      }
      else{
        hasher.setHash('');
      }
    };
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  LoginPage.prototype.dispose = function() { };
  
  return { viewModel: LoginPage, template: templateMarkup };

});
