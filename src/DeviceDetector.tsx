declare var manywho: any;

import * as React from 'react';

class DeviceDetector extends React.Component<any, any> 
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
        this.detectDevice();
        //this.forceUpdate();
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
       
    render()
    {
        const flowModel = manywho.model.getComponent(this.componentId,   this.flowKey);
        const flowState = manywho.state.getComponent(this.componentId,   this.flowKey);

        var filePick : any;
        var caption : string = this.getAttribute("Title") || "Select File";
        var width = flowModel.width + "px";
        var height=flowModel.height + "px";

        var style : any = {};
        style.width = width;
        style.height = height;

        var label = "OS:" + this.platform + " Browser:" + this.vendor + " - " + this.product + " Latitude:" + this.latitude + " Longitude:" + this.longitude;

        flowState.contentValue=label;
        return <div>{label}</div>
    }
   
    imhere(result : any)
    {
        this.latitude = result.coords.latitude;
        this.longitude = result.coords.longitude;
        this.forceUpdate();
    }
    
    detectDevice()
     {
        this.platform = navigator.platform;
        this.product = navigator.product;
        this.vendor = navigator.vendor;
        navigator.geolocation.getCurrentPosition(this.imhere.bind(this));
        var deviceName;

        return deviceName;
    }

    
}

manywho.component.register('DeviceDetector', DeviceDetector);

export default DeviceDetector;


