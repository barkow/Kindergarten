define(['knockout', 'text!./family-details-page.html', 'hasher'], function(ko, templateMarkup, hasher) {

  function FamilydetailsPage(params) {
    var self = this;
		
    self.id = params.route.familyId;
    self.name = ko.observable();
    self.children = ko.observableArray();
	  self.contacts = ko.observableArray();
	  self.editMode = ko.observable(true);
	  
	  self.writeData = function(data){
      self.name(data.name);
      self.children.removeAll();
			$.each(data.kinder, function(index, value){
				self.children.push(value);
			});
			self.contacts.removeAll();
			$.each(data.kontaktpersonen, function(index, value){
				self.contacts.push(value);
			});
    };
	  
	  self.getFamily = function(){
	  	$.ajax({
        url: "/server/API/familien/" + self.id,
	      type: "GET",
	      dataType: 'json',
	      username: params.auth.username(),
	      password: params.auth.password()
      }).done(self.writeData);
	  };
	  
	  self.closeClick = function(){
	    if(params.oldroute){
	      hasher.setHash("families");
	    }
	  };
	  
	  self.saveClick = function(){
	    var data = JSON.stringify({name: self.name()});
	    //Wenn id gesetzt ist, dann muss ein Update durchgeführt werden, sonst ein Create
	    if (self.id){
	      $.ajax({
	        url: "/server/API/familien/"+self.id,
	        type: "PUT",
	        dataType: 'json',
	        data: data,
	        username: params.auth.username(),
	      	password: params.auth.password()
        }).done(function(data) {
          self.editMode(false);
          //writeData wird hier nicht ausgeführt, da der PUT Befehl nicht vollständige Informationen über Kinder und Kontaktpersonen zurückliefert
          //self.writeData(data);
        });
	    }
	    else{
	      $.ajax({
	        url: "/server/API/familien",
	        type: "POST",
	        dataType: 'json',
	        data: data,
	        username: params.auth.username(),
	      	password: params.auth.password()
        }).done(function() {
          self.closeClick();
        });
	    }
	  };
	  
	  self.deleteFamily = function(){
	    if(self.id){
	      if(confirm("Soll Familie " + self.name() + " wirklich gelöscht werden")){
  	      $.ajax({
  	        url: "/server/API/familien/"+self.id,
  	        type: "DELETE",
  	        username: params.auth.username(),
	      		password: params.auth.password()
          }).done(function() {
            self.closeClick();
          });
	      }
	    }
	  };
	  
	  //Wenn id gesetzt, dann Daten vom Server laden
	  //Wenn id nicht gesetzt, soll ein neuer Datensatz angelegt werden
	  if (self.id){
	    self.getFamily();
	    self.editMode(false);
	  }
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  FamilydetailsPage.prototype.dispose = function() { };
  
  return { viewModel: FamilydetailsPage, template: templateMarkup };

});
