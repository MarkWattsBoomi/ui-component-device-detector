import * as React from 'react';

class Map extends React.Component <any, any>
{
    map : any;
    googleMapsURL=""; //https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ2cbjJkFl5qygZYcKrcZVTzfX70G_-nY";

    constructor(props : any) 
    {
        super(props);
        this.onScriptLoaded = this.onScriptLoaded.bind(this);
    }

    //fires when component is mounted / complete
    componentDidMount() 
    {
        //request the google maps api script to be added
        var apiKey = this.props.apiKey;
        this.googleMapsURL="https://maps.googleapis.com/maps/api/js?key=" + apiKey;
        this.addMapsScript();
    }

    //this function adds the google maps script to the page
    //the this.onScriptLoaded method will be fired when the script has completed loading
    addMapsScript() 
    {
        if (!document.querySelectorAll(`[src="${this.googleMapsURL}"]`).length) 
        { 
          document.body.appendChild(Object.assign(
            document.createElement('script'), {
              type: 'text/javascript',
              src: this.googleMapsURL,
              onload: () => this.onScriptLoaded()
            }));
        } else {
          this.onScriptLoaded();
        }
      }

      //this handler fires when the google maps script has loaded
      onScriptLoaded()
      {
        //force number args into floats & ints
        var centre = {lng: parseFloat(this.props.centre.lng) , lat: parseFloat(this.props.centre.lat) };
        var zoom = parseInt(this.props.zoom);
        
        //create a new options object
        var options = {center : centre, zoom : zoom};

        var opts : any;

        //create a map
        this.map = new google.maps.Map( document.getElementById("map"), options);

        if(this.props.markers)
        {
            for(var mPos = 0 ; mPos < this.props.markers.length ; mPos++)
            {
                var marker = this.props.markers[mPos];
                var position = {lng: parseFloat(marker.props.center.lng) , lat: parseFloat(marker.props.center.lat) };
                opts = {position: position, map : this.map, title : marker.props.title };
                var oMarker = new google.maps.Marker(opts);
            }
        }
        if(this.props.hotSpots)
        {
            for(var hPos = 0 ; hPos < this.props.hotSpots.length ; hPos++)
            {
                var hotSpot = this.props.hotSpots[hPos];
                var position = {lng: parseFloat(hotSpot.props.center.lng) , lat: parseFloat(hotSpot.props.center.lat) };
                var diameter = parseInt(hotSpot.props.diameter);
                var title = hotSpot.props.title;
                var data = this.getData(position);
                opts = {
                        clickable: true,
                        strokeColor: '#0000FF',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#eeeeff',
                        fillOpacity: 0.35,
                        map : this.map,
                        center:  position,
                        title : title, 
                        radius: diameter};
                var oHotSpot = new google.maps.Circle(opts);

                var infoWindow = new google.maps.InfoWindow({
                    content: title
                  });

                  oHotSpot.addListener('click', function(ev){
                    infoWindow.setPosition(ev.latLng);
                    infoWindow.open(this.map);
                  });
            }
        }
        
        
      }
    
      render() 
      {
        return <div style={{ width: '100%', height: '100%' }} id="map" />
      }

      getData(position : any)
      {
        return new google.maps.LatLng(position.lat, position.lng);
      }
}

export default Map
