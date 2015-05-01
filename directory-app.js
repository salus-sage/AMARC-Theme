window.AMARC = window.AMARC || {};
AMARC.search = function() {
  $('#searchbtn').on('click', function(e) {
    AMARC.getResults();
  });
  $("#searchtxt").on('change', function(e) { 
    if(!$(e.currentTarget).val()) { 
      $("#resultsInfo").html('');
      $("#searchTable").html('');
      $("#searchtxt").val('');
      $("#directory-tool-bar").removeClass('in');
    }
  });
  };

  $("#next-tbody").on('click', function() { 
    var id = $('table').find('tbody.in').attr('id');
    if($('#'+id).next('tbody').length > 0) {
      $('table').find('tbody.in').removeClass('in');
      $('#'+id).next('tbody').addClass('in');
    }
  });
  
  $("#prev-tbody").on('click', function() { 
    var id = $('table').find('tbody.in').attr('id')
    if($('#'+id).prev('tbody').length > 0) { 
      $('#'+id).removeClass('in');
     $('#'+id).prev('tbody').addClass('in');
    }
  });
  
  $("#refresh-search-table").on("click", function() { 
    $("#resultsInfo").html('');
    $("#searchTable").html('');
    $("#searchtxt").val('');
    $("#directory-tool-bar").removeClass('in');
  });
  
   $('#searchtxt').on('keypress', function(event) {
     if(event.which==13){
      AMARC.getResults();
     }
  });
 $('#directory-info').on("mouseenter", function(event){
   $('[data-toggle="popover"]').popover('show');
 });
  $('#directory-info').on("mouseleave", function(event){
   $('[data-toggle="popover"]').popover('hide');
 });
    
  
  
  AMARC.getResults = function () { 
    $.ajax({
      'type': 'GET',
      'url': 'http://pensieve.pantoto.org/search/amarc-ap.org/json?',
      'data':{'q': $('#searchtxt').val().toLowerCase()},
      'dataType': "json"
    }).done(function(data) {
      $("#resultsInfo").html('');
      $("#searchTable").html('');
      $("#directory-tool-bar").addClass("in");  
      var infoTemplate = _.template($("#results-info-template").html());
      $("#resultsInfo").append(infoTemplate({'len': data.hits.length}));
      if(data.hits.length) {
        var template = _.template($("#results-template").html());
        _.each(data.hits, function(record, recordKey) {
          var el_template = _.template($('#results-tbody').html());
          el = el_template({'id':'mouchak-table'+recordKey});
          $("#searchTable").append(el);
          if(recordKey === 0) { 
              $("#mouchak-table"+recordKey).addClass('in');
            }
  
          var rowOrder = ['Station title', 'Station name', 'Country', 'Type', 'Address','Contact Person',
          'Year establishment','Main Activities Of Organization', 'Broadcast Hours', 'Program Types', 
          'Total Hours of Programs by and for Women Broadcasted per Week', 'Languages of Broadcast', 
          'Area Coverage', 'Population Size', 'Transmission Power (WATTS)', 'Number of Staff',
          'Number of Production Staff', 'Number of Technical Staff', 'Number of Volunteers',
          'Number of Persons at Management Level','Target Community of the Station',
          'Donors that Support the Radio Station', 'List of Publications Related to Community Radio'];
          
          _.each(rowOrder, function(val, key) { 
            // Append the relevant entry from record._source to the table's body
            // scan rowOrder to pick values from record._source for the template
            $("#mouchak-table"+recordKey).append(template({'key': val, 'val': record._source[val]}));
          });
          });
        }
    });
};
