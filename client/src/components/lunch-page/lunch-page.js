define(['knockout', 'text!./lunch-page.html',"knockout-x-editable"], function(ko, templateMarkup) {
  
  function Lunch(){
    var self = this;
    self.surname = ko.observable();
    self.givenname = ko.observable();
    self.costBreakfast = ko.observable();
    self.numberOfLunch = ko.observable();
    self.costLunch = ko.observable();
    self.totalCost = ko.computed(function(){
      var total = parseFloat(self.costLunch()) * parseFloat(self.numberOfLunch()) + parseFloat(self.costBreakfast());
      return total.toFixed(2);
    });
  }

  function LunchPage(params) {
    var self = this;
    self.now = new Date();
    self.lunches = ko.observableArray();
    self.month = ko.observable(formatDate(self.now));
    
    
    self.getLunches = function(month){
      self.lunches.removeAll();
      $.ajax({
	        url: "/server/API/mittagessen/monat/"+month,
	        type: "GET",
	        dataType: 'json'
        }).done(function(data) {
          $.each(data, function(index, value){
            var lunch = new Lunch();
            lunch.surname(value.name);
            lunch.givenname(value.vorname);
            lunch.costBreakfast(value.pauschaleFruehstueck);
            lunch.numberOfLunch(value.anzahlMittagessen);
            lunch.costLunch(value.kostenMittagessen);
            self.lunches.push(lunch);
          });
        });
    };
    
    self.monthUpdater = ko.computed(function(){
      self.getLunches(self.month());
    });
    
    self.newMonthClick = function(){
      $.ajax({
	        url: "/server/API/mittagessen/monat",
	        type: "POST",
	        dataType: 'json',
	        data: JSON.stringify({
	          abrechnungsmonat: self.month(),
	          kostenMittagessen: 3.5,
	          pauschaleFruehstueck: 7.0
	        })
        }).done(function() {
          self.getLunches(self.month());
        });
    };
    
    function formatDate(d) {
      var dd = d.getDate();
      if ( dd < 10 ) dd = '0' + dd;
      var mm = d.getMonth()+1;
      if ( mm < 10 ) mm = '0' + mm;
      var yyyy = d.getFullYear();
      return yyyy+'-'+mm;
    }
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  LunchPage.prototype.dispose = function() { };
  
  return { viewModel: LunchPage, template: templateMarkup };

});
