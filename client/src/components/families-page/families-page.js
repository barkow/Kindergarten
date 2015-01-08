define(['knockout', 'text!./families-page.html', 'hasher'], function(ko, templateMarkup, hasher) {

  function FamiliesPage(params) {
    var self = this;
    
    self.families = ko.observableArray();
    
    self.getFamilies = function(){
      console.log(params.auth.username());
      $.ajax({
	        url: "/server/API/familien",
	        type: "GET",
	        dataType: 'json',
	        username: params.auth.username(),
	        password: params.auth.password()
        }).done(function(data) {
          self.families.removeAll();
          $.each(data, function(index, value){
            self.families.push(value);
          });
        });
      /*$.getJSON("", function(data) { 
        self.families.removeAll();
        $.each(data, function(index, value){
          self.families.push(value);
        });
		  }).error(function(data){
		    console.log(data); 
		    //hasher.setHash('login');
		  });*/
    };
    
    self.getFamilies();
    console.log(params);
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  FamiliesPage.prototype.dispose = function() { };
  
  return { viewModel: FamiliesPage, template: templateMarkup };

});
