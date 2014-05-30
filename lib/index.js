// jsdom = require ('jsdom');
// Create a fake DOM/jQuery for testing UI components
// global.window = jsdom.jsdom().createWindow();
// create a fake DOM
// global.document = window.document;
// global.$ = require('jquery');
// http = require('http');
httpsync = require('httpsync');//make request synchronous
functions = require('./functions');//personal functions
querystring = require('querystring');//create strings for send body in forms
// request = require('request');
cheerio = require('cheerio');//scrapping a web page

(function() {

	function Courier() {
/*
	Functions for USPS
*/
		function getJsonUsps(buffer){
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

				var ArrayCheckpoints = [];
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
			result_json=getJsonUsps(xml_response);
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

		/*
			Functions HKpost
		*/
		this.hkpost = function(tracking_number) {
			var tracking_result = {}; // save your result to this object
		//	var url_hkpost = 'http://app3.hongkongpost.hk/CGI/mt/enquiry.jsp';
			var post_data = querystring.stringify({'tracknbr':tracking_number,'submit':'Enter'});
			console.log(post_data+' '+post_data.length);
			var url_hkpost = 'http://app3.hongkongpost.hk/CGI/mt/mtZresult.jsp';
			console.log('starting the request');
			var req = httpsync.request({
				method: 'POST',
				url: url_hkpost,
				headers: {
					'content-type' : 'application/x-www-form-urlencoded',
					'content-length': post_data.length }
			});
			req.write(post_data);

			var res = req.end();
			console.log('after the request');

			var html_response = res.data.toString('UTF-8');

			console.log(res);
			console.log('*********************');
		//	functions.writeFile('../response.html',html_response);
			var $ = cheerio.load(html_response);
			var div_container = $('#clfContent').html();
			var country_html = $('span.textNormalBlack').parent().html();
			var message = functions.substringSkipStart(country_html,'<br',div_container);
			var message_formatted = functions.removeLineBreaks($(message).text()).trim();
			var country = functions.substringSkipStart('</span> -','',country_html).trim();
			var country_code = functions.getCodeCountry(country);
			console.log('country **'+country);
			console.log('message **'+message_formatted);
			var date_rough = functions.substringSkipStart('on','.',message_formatted).trim();
			//transform from this 28-May-2014 to this 2013-12-11T00:00:00
			var day = date_rough.substring(0,2);
			var month = functions.getMonthFromString(functions.substringSkipStart('-','-',date_rough));
			var year = date_rough.substring(date_rough.length-4);
			var date = year+'-'+month+'-'+day+'T12:00:00';
			console.log('date **'+date);

			// do your job here

			var ArrayCheckpoints = [];
			ArrayCheckpoints.push(functions.createCheckpointItem(country_code,message_formatted,date));
			tracking_result.checkpoints= ArrayCheckpoints;

			return tracking_result;

		};

		/*
			Functions DPDUK
		*/
		this.dpduk = function(tracking_number) {

			var tracking_result = {}; // save your result to this object
			url_dpd_js='http://www.dpd.co.uk/esgServer/shipping/shipment/_/parcel/?filter=id&searchCriteria=deliveryReference%3D'+tracking_number+'%26';
			var req_js = httpsync.get(url_dpd_js);
			var res_js = req_js.end();
			// console.log(res_js);
			var data_search = res_js.data.toString('UTF-8');
			var cookie_session = data_search.substring(data_search.indexOf('searchSession":"')+16,data_search.indexOf('"}}'));

			url_dpd = 'http://www.dpd.co.uk/esgServer/shipping/delivery/?parcelCode=15502370264989';
			var req = httpsync.request({
				url: url_dpd,
				method: 'GET',
				headers: {
						cookie: 'tracking='+cookie_session
				}
			});
			var res = req.end();

			var json_response = res.data.toString('UTF-8');

			var json_resultado = JSON.parse(json_response).obj.trackingEvent.reverse();
			var ArrayCheckpoints = [];
			tracking_result.checkpoints= ArrayCheckpoints;
			for(var k in json_resultado) {
				var raw_date = json_resultado[k].trackingEventDate;
				var date =raw_date.substring(0,raw_date.indexOf('.'));//take off the last 5 digits
				ArrayCheckpoints.push(functions.createCheckpointItem(json_resultado[k].trackingEventLocation,json_resultado[k].trackingEventStatus,date));
			}
			tracking_result.checkpoints= ArrayCheckpoints;


			return tracking_result;

		};
	}

	module.exports = new Courier();
}());
Courier = require('./index');

var result = Courier.hkpost('RT224265042HK');
console.log(result);
