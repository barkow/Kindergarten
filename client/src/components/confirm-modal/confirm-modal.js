define(['knockout', 'text!./confirm-modal.html'], function(ko, templateMarkup) {

  function ConfirmModal(params) {
    this.message = ko.observable('Hello from the confirm-modal component!');
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  ConfirmModal.prototype.dispose = function() { };
  
  return { viewModel: ConfirmModal, template: templateMarkup };

});
