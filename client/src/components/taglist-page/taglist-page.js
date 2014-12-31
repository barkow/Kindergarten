define(['knockout', 'select2', 'text!./taglist-page.html'], function(ko, select2, templateMarkup) {

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
      return mailAddresses.join(",");
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
