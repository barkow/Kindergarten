define(['knockout', 'select2', 'text!./taglist-page.html', 'select2-ko-binding'], function(ko, select2, templateMarkup) {
  function TaglistPage(params) {
    var self = this;
    
    self.availableTags = ko.observableArray();
    self.selectedTag = ko.observable();
    self.children = ko.observableArray();
    self.mailCollector = ko.computed(function() {
      if (self.children()){
      var mailAddresses = [];
      $.each(self.children(), function(index, child) {
        $.each(child.emailkontakte, function(index, contact){
          mailAddresses.push(contact);
        });
      });
      }
      console.log(mailAddresses);
      return mailAddresses.join("; ");
    });
    
    self.updateChildren = ko.computed(function(){
      if (self.selectedTag()){
      $.getJSON("/server/API/schlagwoerter/"+self.selectedTag()+"/kinder", function(data) { 
        self.children.removeAll();
        $.each(data, function(index, child){
          self.children.push(child);
        });
		  });
      }
    });
    
    self.getAvailableTags = function(){
      self.availableTags.removeAll();
      $.getJSON("/server/API/schlagwoerter", function(data) { 
        $.each(data, function(index, tag){
          self.availableTags.push(tag);
        });
		  });
    };
    
    self.getAvailableTags();
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  TaglistPage.prototype.dispose = function() { };
  
  return { viewModel: TaglistPage, template: templateMarkup };

});
