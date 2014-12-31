define(['knockout', 'text!./family-details-page.html'], function(ko, templateMarkup) {

  function FamilydetailsPage(params) {
    var self = this;
    
    self.id = params.familyId;
    self.name = ko.observable();
    self.children = ko.observableArray();
	  self.contacts = ko.observableArray();
	  self.editMode = ko.observable(false);
	 
	  self.enableFamilienEditMode = function(data, event){
		  self.familienEditMode(true);
	  }
	  
	  self.getFamily = function(){
		  $.getJSON("/server/API/familien/" + self.id, function(data) { 
			  console.log(data);
			  self.name(data.name);
			  $.each(data.kinder, function(index, value){
				  self.children.push(value);
			  });
			  $.each(data.kontaktpersonen, function(index, value){
				  console.log(value);
				  self.contacts.push(value);
			  });
		  });
	  };
	  
	  self.deleteFamily = function(){
	    if(confirm("Soll Familie " + self.name() + " wirklich gelöscht werden")){
	      $.ajax({
	        url: "/server/API/familien/"+self.id,
	        type: "DELETE"
        }).done(function() {
          console.log("deleted");
          location.href = "#families";
        });
	    }
	  };
	  
	  //Wenn id gesetzt, dann Daten vom Server laden
	  //Wenn id nicht gesetzt, soll ein neuer Datensatz angelegt werden
	  if (self.id){
	    self.getFamily();
	  }
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  FamilydetailsPage.prototype.dispose = function() { };
  
  return { viewModel: FamilydetailsPage, template: templateMarkup };

});
