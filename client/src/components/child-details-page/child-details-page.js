define(['knockout', 'select2', 'text!./child-details-page.html', 'hasher', 'select2-ko-binding'], function(ko, select2, templateMarkup, hasher) {
  function ChilddetailsPage(params) {
    var self = this;
    console.log(params);
    self.id = params.route.childId;
    self.familyId = params.route.familyId;
    self.name = ko.observable("");
    self.vorname = ko.observable("");
    self.dateOfBirth = ko.observable();
    self.emailContacts = ko.observableArray();
    self.editMode = ko.observable(true);
    self.availableTags = ko.observableArray();
    self.tags = ko.observableArray();
    
    self.writeData = function(data){
      self.name(data.name);
      self.vorname(data.vorname);
      self.emailContacts(data.emailkontakte);
      self.dateOfBirth(data.geburtsdatum);
      self.tags(data.schlagwoerter);
    };
    
    self.getAvailableTags = function(){
      self.availableTags.removeAll();
      $.getJSON("/server/API/schlagwoerter", function(data) { 
        $.each(data, function(index, tag){
          self.availableTags.push(tag.bezeichnung);
        });
		  });
    };
  
    self.getChild = function(){
      $.getJSON("/server/API/kinder/"+self.id, self.writeData);
	  };
	  
	  self.closeClick = function(){
	    if(params.oldroute){
	      hasher.setHash(params.oldroute);
	    }
	  };
	  
	  self.saveClick = function(){
	    var data = JSON.stringify({name: self.name(), vorname: self.vorname(), geburtsdatum: self.dateOfBirth(), schlagwoerter: self.tags()});
	    //Wenn id gesetzt ist, dann muss ein Update durchgeführt werden, sonst ein Create
	    if (self.id){
	      $.ajax({
	        url: "/server/API/familien/"+self.familyId+'/kinder/'+self.id,
	        type: "PUT",
	        dataType: 'json',
	        data: data
        }).done(function(data) {
          self.editMode(false);
          self.writeData(data);
        });
	    }
	    else{
	      $.ajax({
	        url: "/server/API/familien/"+self.familyId+'/kinder',
	        type: "POST",
	        dataType: 'json',
	        data: data
        }).done(function() {
          self.closeClick();
        });
	    }
	  };
	  
	  self.deleteChild = function(){
	    if(self.id){
	      if(confirm("Soll Kind " + self.name() + " wirklich gelöscht werden")){
  	      $.ajax({
  	        url: "/server/API/familien/"+self.familyId+'/kinder/'+self.id,
  	        type: "DELETE"
          }).done(function() {
            self.closeClick();
          });
	      }
	    }
	  };
	  
	  self.getAvailableTags();
	  //Wenn id gesetzt ist, soll ein bestehendes Kind bearbeitet werden
	  if (self.id){
	    self.editMode(false);
	    self.getChild();
	  }
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  ChilddetailsPage.prototype.dispose = function() { };
  
  return { viewModel: ChilddetailsPage, template: templateMarkup };

});
