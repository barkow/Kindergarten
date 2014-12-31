define(['knockout', 'jquery', 'text!./contact-details-page.html', 'jquery-validation'], function(ko, $, templateMarkup) {

  function ContactsPage(params) {
    var self = this;
    
    self.id = params.contactId;
    self.familyId = params.familyId;
    self.editMode = ko.observable(true);
    self.surname = ko.observable("");
    self.givenname = ko.observable("");
    self.comment = ko.observable("");
		self.email = ko.observable("");
		self.isEmailContact = ko.observable(true);
		self.mobileNo = ko.observable("");
		self.landlineNo = ko.observable("");
		self.additionalNo = ko.observable("");
    
    
    self.getContact = function(){
      $.getJSON("/server/API/familien/"+self.familyId+"/kontaktpersonen/"+self.id, function(data) { 
        self.surname(data.name);
        self.givenname(data.vorname);
        self.comment(data.kommentar);
    		self.email(data.email);
    		self.isEmailContact(data.istStandardEmailKontakt);
    		self.mobileNo(data.mobilNr);
    		self.landlineNo(data.festnetzNr);
    		self.additionalNo(data.sonstNr);
		  });
	  };
	  
	  self.closeClick = function(){
	    history.back();
	  };
	  
	  self.saveClick = function(){
	    //Wenn id gesetzt ist, dann muss ein Update durchgeführt werden, sonst ein Create
	    if (self.id){
	      $.ajax({
	        url: "/server/API/familien/"+self.familyId+'/kontaktpersonen/'+self.id,
	        type: "PUT",
	        dataType: 'json',
	        data: JSON.stringify({
	          name: self.surname(), 
	          vorname: self.givenname(),
	          kommentar: self.comment(),
	          email: self.email(),
	          istStandardEmailKontakt: self.isEmailContact(),
	          mobilNr: self.mobileNo(),
	          festnetzNr: self.landlineNo(),
	          sonstNr: self.additionalNo()
	        })
        }).done(function() {
          self.editMode(false);
        });
	    }
	    else{
	      $.ajax({
	        url: "/server/API/familien/"+self.familyId+'/kontaktpersonen',
	        type: "POST",
	        dataType: 'json',
	        data: JSON.stringify({
	          name: self.surname(), 
	          vorname: self.givenname(),
	          kommentar: self.comment(),
	          email: self.email(),
	          istStandardEmailKontakt: self.isEmailContact(),
	          mobilNr: self.mobileNo(),
	          festnetzNr: self.landlineNo(),
	          sonstNr: self.additionalNo()
	        })
        }).done(function() {
          self.closeClick();
        });
	    }
	  };
	  
	  self.deleteContact = function(){
	    if(self.id){
	      if(confirm("Soll Kontaktperson " + self.givenname() + " " + self.surname() + " wirklich gelöscht werden")){
  	      $.ajax({
  	        url: "/server/API/familien/"+self.familyId+'/kontaktpersonen/'+self.id,
  	        type: "DELETE"
          }).done(function() {
            self.closeClick();
          });
	      }
	    }
	  };
	  
	  if (self.id){
	    self.editMode(false);
	    self.getContact();
	  }
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  ContactsPage.prototype.dispose = function() { };
  
  return { viewModel: ContactsPage, template: templateMarkup };

});
