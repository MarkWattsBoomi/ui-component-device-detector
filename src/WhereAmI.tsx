declare var manywho: any;

import * as React from 'react';
import Map from './Map';
import Marker from "./Marker";
import HotSpot from "./HotSpot";

class WhereAmI extends React.Component<any, any> 
{   
    componentId: string = "";
    flowKey: string ="";    
    attributes : any = {};
    
    platform: string;
    product : string;
    latitude : any;
    longitude : any; 
    device: string;
    vendor: string;

    operatingSystem : string;
    browserName : string;
    browserVendor : string;

    text : string = "";

    constructor(props : any)
	{
        super(props);
        
        this.componentId = props.id;
        this.flowKey = props.flowKey;

        //push attributes into keyed map 
		var flowModel = manywho.model.getComponent(this.props.id,   this.props.flowKey);
		if(flowModel.attributes)
		{
			for(var key in flowModel.attributes)
			{
				this.attributes[key] = flowModel.attributes[key];
			}
        }
    }

    
    componentDidMount() 
    {
        const flowModel = manywho.model.getComponent(this.componentId,   this.flowKey);
        const flowState = manywho.state.getComponent(this.componentId, this.flowKey) || {};

        var objectData : any;
        if(flowState.objectData[0])
        {
            objectData=flowState.objectData[0];
            var props = objectData.properties;
            this.longitude = manywho.utils.getObjectDataProperty(props, "Longitude").contentValue;
            this.latitude = manywho.utils.getObjectDataProperty(props, "Latitude").contentValue;
        }
        else
        {
            objectData=flowModel.objectData[0];
        }

        objectData = JSON.parse(JSON.stringify(objectData));
        
        var newState = {
			objectData: [objectData]
		};
             
        manywho.state.setComponent(this.componentId, newState, this.flowKey, true);

        if(flowModel.isEditable == true)
        {
            this.detectLocation();
        }
        else
        {
            this.forceUpdate();
        }

    }

    componentDidUpdate()
    {

    }

	getAttribute(attributeName : string)
	{
		if(this.attributes[attributeName])
		{
			return this.attributes[attributeName];
		}
		else
		{
			return null;
		}
    }
    
    save()
    {

        const flowState = manywho.state.getComponent(this.componentId, this.flowKey) || {};
        const flowModel = manywho.model.getComponent(this.componentId,   this.flowKey);

        var objectData = flowModel.objectData[0];

        objectData = JSON.parse(JSON.stringify(objectData));

        objectData.isSelected = true;
        
        manywho.utils.setObjectDataProperty(objectData.properties, "OperatingSystem", this.operatingSystem);
        manywho.utils.setObjectDataProperty(objectData.properties, "BrowserVendor", this.browserVendor);
        manywho.utils.setObjectDataProperty(objectData.properties, "BrowserName", this.browserName);
        manywho.utils.setObjectDataProperty(objectData.properties, "Longitude", this.longitude);
        manywho.utils.setObjectDataProperty(objectData.properties, "Latitude", this.latitude);

        var newState = {
            objectData: [objectData]
        };
            
        manywho.state.setComponent(this.componentId, newState, this.flowKey, true);

        this.forceUpdate();
    }
       
    render()
    {
        const flowModel = manywho.model.getComponent(this.componentId,   this.flowKey);
        const flowState = manywho.state.getComponent(this.componentId,   this.flowKey);

        var caption : string = this.getAttribute("Title") || "Select File";
        var zoom : number = parseInt(this.getAttribute("Zoom") || 18);
        var apiKey = this.getAttribute("ApiKey") || this.getAttribute("apiKey") || "";
        var showCurrentLocation =  this.getAttribute("ShowCurrentLocation") ||  "false";
        if(showCurrentLocation.toLowerCase() == "true")
        {
            showCurrentLocation=true;
        }
        else
        {
            showCurrentLocation=false;
        }
        var currentLocationCaption = this.getAttribute("CurrentLocationLabel") || "Here";
        var width = flowModel.width + "px";
        var height=flowModel.height + "px";

        var style : any = {};
        style.width = '100%';
        style.height = height;


        var map : any;

        if(this.longitude && this.latitude)
        {
            var pos = {lat: this.latitude, lng: this.longitude};

            var markers : any = [];
            var hotspots : any = [];

            if(showCurrentLocation)
            {
                markers.push(<Marker props={this.props} center={pos} title={currentLocationCaption}></Marker>);
                hotspots.push(<HotSpot props={this.props} center={pos} diameter={20} title="Some Area"></HotSpot>);
            }

            
            

            map =   <Map centre={pos} zoom={zoom} markers={markers} hotSpots={hotspots} apiKey={apiKey}>
                        {markers}
                        {hotspots}
                    </Map>

        }

            return  <div style={style}>{map}</div>
                       

    }
   
    handleApiLoaded(map : any, maps : any)
    {
        var x = map;
    }

    imhere(result : any)
    {
        this.latitude = result.coords.latitude;
        this.longitude = result.coords.longitude;
        this.operatingSystem = navigator.platform;
        this.browserName = navigator.product;
        this.browserVendor = navigator.vendor;
        this.save();
        
    }
    
    detectLocation()
    {
        navigator.geolocation.getCurrentPosition(this.imhere.bind(this));
        this.operatingSystem = navigator.platform;
        this.browserName = navigator.product;
        this.browserVendor = navigator.vendor;
        this.save();
    }

    
}

manywho.component.register('WhereAmI', WhereAmI);

export default WhereAmI;

