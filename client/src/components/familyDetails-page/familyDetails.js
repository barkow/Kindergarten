define(["knockout", "text!./familyDetails.html"], function(ko, familyDetailsTemplate) {

  function FamilyDetailsViewModel(route) {
    this.message = ko.observable('Welcome to Für uns Pänz!');
  }

  FamilyDetailsViewModel.prototype.doSomething = function() {
    this.message('You invoked doSomething() on the viewmodel.');
  };
  
  console.log("FamilyDetails");
  
  return { viewModel: FamilyDetailsViewModel, template: familyDetailsTemplate };

});
