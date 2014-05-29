jsdom = require ('jsdom');
// Create a fake DOM/jQuery for testing UI components
global.window = jsdom.jsdom().createWindow();
// create a fake DOM
global.document = window.document;
global.$ = require('jquery');
url = require('url');
http = require('http');
xml2js = require('xml2js');
httpsync = require('httpsync');
functions = require('./functions');

(function() {

	function Courier() {

		function getJSONUSP(buffer){
			var jsonObj = {};

			if (buffer.indexOf('<error>')!==-1){
				var description = functions.getElementXML('description',buffer);
				jsonObj.error = description;
			}else{
				// get the summary of xml
				var TrackSummary = functions.getElementXML('TrackSummary',buffer);
				// get the message of the Event
				var eventName =  functions.getElementXML('Event',TrackSummary);
				//	transform time from this format 12:57 pm
				var eventTime = functions.getElementXML('EventTime',TrackSummary);
				var time = 'T'+ functions.hourTo24h(eventTime.substring(0,2),eventTime.substring(6,8))+//hour
					eventTime.substring(2,5)+':00';//min and seg
				//	transform day from this format January 15, 2014
				var eventDate = functions.getElementXML('EventDate',TrackSummary);
				var coma =eventDate.indexOf(',');
				var day= eventDate.substring(coma+2,coma+2+4)+'-'+//year
					functions.getMonthFromString(eventDate.substring(0,eventDate.indexOf(' ')))+'-'+//month
					eventDate.substring(eventDate.indexOf(' ')+1,coma);//day

				ArrayCheckpoints = [];
				ArrayCheckpoints.push(functions.createCheckpointItem('',eventName,day+time));
				jsonObj.checkpoints= ArrayCheckpoints;
			}
			return jsonObj;

		}
		this.conection_http_get_xml = function(uspsUrl){
			//get sync connection
			var req = httpsync.get(uspsUrl);
			var res = req.end();
			var xml_response = res.data.toString('UTF-8');
			result_json=getJSONUSP(xml_response);
			return result_json;
		};

		this.usps = function(tracking_number) {
			var userId ='230ASFAS3759';//user ID de USPS
			var api_USPS = 'http://production.shippingapis.com/ShippingAPITest.dll'; //url API
			var parameter_USPS = '?API=TrackV2&XML=<TrackFieldRequest%20USERID="'+userId+ //add XML petition
			'"><TrackID%20ID="'+tracking_number+
			'"></TrackID></TrackFieldRequest>';
			this.conection_http_get_xml(api_USPS+parameter_USPS);

			return result_json;
		};

		this.hkpost = function(tracking_number) {
			var tracking_result = {}; // save your result to this object

			// do your job here
			return tracking_result;

		};

		this.dpduk = function(tracking_number) {
			var tracking_result = {}; // save your result to this object

			// do your job here
			return tracking_result;

		};
	}

	module.exports = new Courier();
}());
Courier = require('./index');

//jajajaja
var result = Courier.usps('9102999999302024326992');
//console.log(result);
