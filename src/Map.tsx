import * as React from 'react';
import * as Google from 'google-maps';
import Marker from './Marker';

class Map extends React.Component <any, any>
{

    googleMapsURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ2cbjJkFl5qygZYcKrcZVTzfX70G_-nY";
    constructor(props : any) 
    {
        super(props);
        this.onScriptLoaded = this.onScriptLoaded.bind(this);
    }

    //fires when component is mounted / complete
    componentDidMount() 
    {
        //request the google maps api script to be added
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

        //create a map
        const map = new google.maps.Map( document.getElementById("map"), options);

        
        if(this.props.children)
        {
            switch(Object.prototype.toString.call(this.props.children))
            {
                case "[object Array]":
                    var array =this.props.children as any[];
                    for(var mPos = 0 ; mPos < array.length ; mPos++)
                    {
                        var position = {lng: parseFloat(array[mPos].props.center.lng) , lat: parseFloat(array[mPos].props.center.lat) };
                        var opts = {position: position, map : map, title : array[mPos].props.title };
                        var marker = new google.maps.Marker(opts);
                    }
                    break;

                case "[object Object]":
                    var obj = this.props.children as any;
                    var position = {lng: parseFloat(obj.props.center.lng) , lat: parseFloat(obj.props.center.lat) };
                    var opts = {position: position, map : map, title : obj.props.title };
                    var marker = new google.maps.Marker(opts);
            }
            
        }
      }
    
      render() 
      {
        return <div style={{ width: '100%', height: '100%' }} id="map" />
      }
}

export default Map
