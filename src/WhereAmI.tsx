declare var manywho: any;

import * as React from 'react';
import Map from './Map';

class Marker extends React.Component<any, any> 
{
    text : string = "here";
    render()
    {
        const K_WIDTH = 40;
        const K_HEIGHT = 40;

        const MarkerStyle = {
            // initially any map object has left top corner at lat lng coordinates
            // it's on you to set object origin to 0,0 coordinates
            position: 'absolute' as 'absolute',
            width: K_WIDTH,
            height: K_HEIGHT,
            left: -K_WIDTH / 2,
            top: -K_HEIGHT / 2,
            border: '5px solid #f44336',
            borderRadius: K_HEIGHT,
            backgroundColor: 'white',
            textAlign: 'center' as 'centre',
            color: '#3f51b5',
            fontSize: 16,
            fontWeight: 'bold' as 'bold',
            padding: 4
          };

        return <div style={MarkerStyle}>{this.text}</div>
    }
}

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
        var apiKey = this.getAttribute("ApiKey") || "";
        var width = flowModel.width + "px";
        var height=flowModel.height + "px";

        var style : any = {};
        style.width = '100%';
        style.height = height;


        var map : any;

        if(this.longitude && this.latitude)
        {
            var pos = {lat: this.latitude, lng: this.longitude};
            //var markers = [{position: pos, title: "Here"}];
            //var options = {center:pos, zoom:zoom};

            map = <Map centre={pos} zoom={zoom}>
                <Marker center={pos} title="Here"></Marker>
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

