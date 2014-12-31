define(['knockout', 'text!./families-page.html'], function(ko, templateMarkup) {

  function FamiliesPage(params) {
    var self = this;
    
    self.families = ko.observableArray();
    
    self.getFamilies = function(){
      $.getJSON("/server/API/familien", function(data) { 
        self.families.removeAll();
        $.each(data, function(index, value){
          self.families.push(value);
        });
		  });
    };
    
    self.getFamilies();
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  FamiliesPage.prototype.dispose = function() { };
  
  return { viewModel: FamiliesPage, template: templateMarkup };

});
