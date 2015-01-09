define(['knockout', 'text!./next-birthdays-element.html'], function(ko, templateMarkup) {

  function NextBirthdaysElement(params) {
    var self = this;
    
    self.nextBirthdayChildren = ko.observableArray();
    
    $.ajax({
      url: "/server/API/kinder",
      type: "GET",
      dataType: 'json'
    }).done(function(data) {
      self.nextBirthdayChildren.removeAll();
      var heute = new Date();
      $.each(data, function(index, child){
        if(child.geburtsdatum){
          var geb = new Date(child.geburtsdatum);
          var gebHeuer = new Date(heute.getFullYear(), geb.getMonth(), geb.getDate());
          //Differenz wird in Millisekunden berechnet
          var diff = gebHeuer - heute
          if ((diff >= 0) && (diff <= 1000*60*60*24*14)){
            self.nextBirthdayChildren.push(child);
          }
        }
      });
    });
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  NextBirthdaysElement.prototype.dispose = function() { };
  
  return { viewModel: NextBirthdaysElement, template: templateMarkup };

});
