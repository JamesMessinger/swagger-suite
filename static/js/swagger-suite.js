(function() {
  'use strict';

  var metadata;


  $(function() {
    // Load the page header template
    $.get('/static/_header.html')
      .done(function(html) {
        // Display the page header
        $('body').prepend(html);

        // Get the metadata immediate, and every couple seconds
        getMetadata();
        setInterval(getMetadata, 2000);

        // Enable Bootstrap tooltips
        $('.navbar-hover-effect').tooltip({ container: 'body' });
      })
      .fail(handleError);
  });


  // Gets the latest Swagger-Suite metadata and updates the UI
  function getMetadata() {
    $.get('/static/metadata.json')
      .done(function(newMetadata) {
        // Determine if the metadata has changed
        newMetadata.specDate = new Date(newMetadata.specDate);

        if (!metadata || metadata.specDate < newMetadata.specDate) {
          // The metadata has changed
          metadata = newMetadata;
          processMetadata();
        }
      })
      .fail(handleError);
  }


  // Updates the UI with the latest metadata
  function processMetadata() {
    $('.api-title').text(metadata.info.title);
    $('.api-version').text(metadata.info.version);

    if (metadata.settings.docs.enabled) {
      $('.navbar-brand').attr('href', metadata.settings.docs.route);
    }

    if (metadata.settings.editor.enabled) {
      $('#swagger-editor').removeClass('hidden').attr('href', metadata.settings.editor.route);
    }

    if (metadata.settings.swaggerUI.enabled) {
      $('#swagger-ui').removeClass('hidden').attr('href', metadata.settings.swaggerUI.route);
    }

    handleError(metadata.error);
  }


  // Displays an error alert if possible; otherwise throws
  function handleError(error, status, message) {
    var $errorIndicator = $('#server-error');
    var $errorModal = $('#error-modal');

    if (!error) {
      $errorIndicator.addClass('hidden');
      $errorModal.modal('hide');
    }
    else {
      error = error || {};
      error.status = error.status || status || '';
      error.type = error.type || 'Error';
      error.message = error.message || message || 'Unknown Error';

      if ($errorIndicator.length === 0) {
        // there's nowhere to display the error, so throw it
        throw error;
      }

      $errorIndicator.removeClass('hidden');
      $errorModal.find('.modal-title').text(error.status + ' ' + error.type);
      $errorModal.find('.modal-body').html(error.message.replace(/\n/g, '<br>'));
    }
  }


  // Display the current error in a modal
  function showError() {

  }


})();
