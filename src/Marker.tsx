import * as React from 'react';
import * as Google from 'google-maps';

class Marker extends React.Component <any, any>
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
        //force number args into ints
        var centre = {lng: parseInt(this.props.centre.lng) , lat: parseInt(this.props.centre.lat) };
        var title = this.props.title;

        //get parent map
        var map = this.props.map;
        //const map = new google.maps.Map( document.getElementById("map"), options);

        var opts = {position: centre, map : map, title : title }
        var marker = new google.maps.Marker(opts);

      }
    
      render() 
      {
        return <div style={{ width: '100%', height: '100%' }}  />
      }
}

export default Map
