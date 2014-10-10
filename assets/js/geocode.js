(function($){
  
  $(document).ready(function(){

    var node = document.getElementById('result');

    function showPosition(position) {
        node.innerHTML = "<p>Browser coordinates: Latitude: " + position.coords.latitude + 
        " Longitude: " + position.coords.longitude + '</p> '; 

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
        url += lat + ',' + lng;

        $.ajax({
               url: url,
               type: 'GET',
               dataType: 'json',
               success:function(resp){
                 str = '<p>geocoderesults: </p>';
                 if(resp.results){
                   for(var i=0; i< resp.results.length;i++){
                     str = '<p>';
                     for(var n in resp.results[i]){
                       str += JSON.stringify(resp.results[i][n]);
                     }
                     str += '</p>';
                   }
                   node.innerHTML += str;
                 }
               }
           });

    }

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
        node.innerHTML = "Geolocation is not supported by this browser.";
      }
    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                node.innerHTML = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                node.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                node.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                node.innerHTML = "An unknown error occurred."
                break;
        }
    }

    setTimeout(function() {
      
      getLocation();

    }, 500);

  });

})(jQuery);