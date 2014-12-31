define(['knockout', 'select2', 'text!./child-details-page.html'], function(ko, select2, templateMarkup) {
  
ko.bindingHandlers.select2 = {
    init: function(el, valueAccessor, allBindingsAccessor, viewModel) {
      ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
        $(el).select2('destroy');
      });

      var allBindings = allBindingsAccessor(),
          select2 = ko.utils.unwrapObservable(allBindings.select2);
      $(el).select2(select2);
    },
    update: function (el, valueAccessor, allBindingsAccessor, viewModel) {
        var allBindings = allBindingsAccessor();

        if ("value" in allBindings) {
            $(el).select2("val", allBindings.value());
        } else if ("selectedOptions" in allBindings) {
            var converted = [];
            var textAccessor = function(value) { return value; };
            if ("optionsText" in allBindings) {
                textAccessor = function(value) {
                    var valueAccessor = function (item) { return item; }
                    if ("optionsValue" in allBindings) {
                        valueAccessor = function (item) { return item[allBindings.optionsValue]; }
                    }
                    var items = $.grep(allBindings.options(), function (e) { return valueAccessor(e) == value});
                    if (items.length == 0 || items.length > 1) {
                        return "UNKNOWN";
                    }
                    return items[0][allBindings.optionsText];
                }
            }
            $.each(allBindings.selectedOptions(), function (key, value) {
                converted.push({id: value, text: textAccessor(value)});
            });
            $(el).select2("data", converted);
        }
        if ("readonly" in allBindings.select2){
          $(el).select2("readonly", allBindings.select2.readonly);
        }
    }
};

  function ChilddetailsPage(params) {
    var self = this;
    
    self.id = params.childId;
    self.familyId = params.familyId;
    self.name = ko.observable();
    self.vorname = ko.observable();
    self.emailContacts = ko.observableArray();
    self.editMode = ko.observable(true);
    self.availableTags = ko.observableArray();
    self.tags = ko.observableArray();
    
    self.getAvailableTags = function(){
      self.availableTags.removeAll();
      $.getJSON("/server/API/schlagwoerter", function(data) { 
        $.each(data, function(index, tag){
          self.availableTags.push(tag.bezeichnung);
        });
		  });
    };
  
    self.getChild = function(){
      $.getJSON("/server/API/kinder/"+self.id, function(data) { 
        self.name(data.name);
        self.vorname(data.vorname);
        self.emailContacts(data.emailkontakte);
        self.tags(data.schlagwoerter);
		  });
	  };
	  
	  self.closeClick = function(){
	    history.back();
	  };
	  
	  self.saveClick = function(){
	    //Wenn id gesetzt ist, dann muss ein Update durchgeführt werden, sonst ein Create
	    if (self.id){
	      $.ajax({
	        url: "/server/API/familien/"+self.familyId+'/kinder/'+self.id,
	        type: "PUT",
	        dataType: 'json',
	        data: JSON.stringify({name: self.name(), vorname: self.vorname(), schlagwoerter: self.tags()})
        }).done(function() {
          self.editMode(false);
        });
	    }
	    else{
	      $.ajax({
	        url: "/server/API/familien/"+self.familyId+'/kinder',
	        type: "POST",
	        dataType: 'json',
	        data: JSON.stringify({name: self.name(), vorname: self.vorname(), schlagwoerter: self.tags()})
        }).done(function() {
          self.closeClick();
        });
	    }
	  };
	  
	  self.deleteChild = function(){
	    if(self.id){
	      if(confirm("Soll Familie " + self.name() + " wirklich gelöscht werden")){
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
