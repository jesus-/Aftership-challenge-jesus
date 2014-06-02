
var httpsync = require('httpsync'),//make request synchronous
		functions = require('./functions'),//personal functions
		querystring = require('querystring'),//create strings for send body in forms
		cheerio = require('cheerio');//scraping a web page

var ERROR_NOT_FOUND = 'Track number not found';
var ERROR_RESPONSE_NOT_200 ='We are sorry, there is a problem with the server';

(function() {

	function Courier() {
/*
	Function USPS
	For get the information, just request to the API the information,
	it will return an XML.
*/
		this.usps = function(tracking_number) {

			var tracking_result = {},
					user_id ='230ASFAS3759',//user ID de USPS
					api_USPS = 'http://production.shippingapis.com/ShippingAPITest.dll', //url API
					name_api =	'TrackV2',
					xml_request = '<TrackFieldRequest USERID="'+user_id+'"><TrackID ID="'+tracking_number+
					'"></TrackID></TrackFieldRequest>',
					parameters_request = '?'+ querystring.stringify({ API: name_api, XML: xml_request});

			var req = httpsync.get(api_USPS+parameters_request),//make request to the API
					res = req.end();

			if (res.statusCode !==200){//control server answering another code
				throw ERROR_RESPONSE_NOT_200;
			}

			var xml_response = res.data.toString('UTF-8');//Xml response from our petition

			var $ = cheerio.load(xml_response, { //load response in cheerio
				normalizeWhitespace: true,
				xmlMode: true
			});

			if ($('Error').length){//if there is a tag Error
				var description = $('Error').children('Description').text();//get description of error
				if (description ==='No record of that item'){
					throw ERROR_NOT_FOUND;
				}
				throw description; //trhow an exception with the description of the error
			}else{
				var checkpoints_array = [], event_name, event_time, hour12, hour24, min,
				type_hour, time, event_date, coma,day, place;
				//get all the elements TrackSummary and TrackDetail, and iterate through them
				$('TrackSummary, TrackDetail').each(function(i, elem) {

					event_name='',event_time='',time='',event_date='',day='',place='';

					event_name =  $(this).children('Event').text();
					//	transform time from this format 2:57 pm to 14:57:00
					event_time = $(this).children('EventTime').text();
					time=functions.parseHourUSPS(event_time);
					//	transform day from this format January 15, 2014 to 2014-01-15
					event_date = $(this).children('EventDate').text();
					day = functions.parseDayUSPS(event_date);
					//get country, in this case is place
					place = $(this).children('EventCity').text();

					checkpoints_array.push(functions.createCheckpointItem(place,event_name,day+time));

				});
				tracking_result.checkpoints= checkpoints_array;
			}
			return tracking_result;

		};

		/*
			Function Hong Kong post
			For get the information, request the hmtl to the page, and make a scraping for
			get the information we need.
		*/
		this.hkpost = function(tracking_number) {
			var tracking_result = {},
					post_data = querystring.stringify({'tracknbr':tracking_number,'submit':'Enter'}),//data to post in the body
					url_hkpost = 'http://app3.hongkongpost.hk/CGI/mt/mtZresult.jsp',//url make the post
					req = httpsync.request({//format of post
						method: 'POST',
						url: url_hkpost,
						headers: {
							'content-type' : 'application/x-www-form-urlencoded',
							'content-length': post_data.length }
					});

			req.write(post_data);//write the body(our tracking number);

			var res = req.end();

			if (res.statusCode !==200){//control server anwsering another code
				throw ERROR_RESPONSE_NOT_200;
			}

			var html_response = res.data.toString('UTF-8');//we get a html page to scrape
			var $ = cheerio.load(html_response),
					div_container = $('#clfContent').html();//get div with content

			if (!$('span.textNormalBlack').length){//if doesnt have the country in bold
				throw ERROR_NOT_FOUND;
			}
			var country_html = $('span.textNormalBlack').parent().html(),//get country html
					message = functions.substringSkipStart(country_html,'<br',div_container),
					message_formatted = functions.removeLineBreaks($(message).text()).trim(),
					country = functions.substringSkipStart('</span> -','',country_html).trim();
					country_code = functions.getCodeCountry(country),//get the country code
					date_rough = functions.substringSkipStart(' on ','.',message_formatted).trim();
			//transform from this 28-May-2014 to this 2013-12-11T00:00:00
			var date = functions.parseDayHKPost(date_rough)+'T00:00:00';

			var checkpoints_array = [];
			//insert checkpoint generate
			checkpoints_array.push(functions.createCheckpointItem(country_code,message_formatted,date));
			tracking_result.checkpoints= checkpoints_array;

			return tracking_result;

		};

		/*
			Function DPDUK
			We need a cookie for make a request of the information, so first we make
			a request to a direction and get the cookie, and then make the proper request,
			it will response a Json file, we barely need to process the information
		*/
		this.dpduk = function(tracking_number) {

			var tracking_result = {},
					parameters_request_cookie = '?'+ querystring.stringify(
						{ filter: 'id', searchCriteria: 'deliveryReference='+tracking_number}),
					url_dpd_cookie='http://www.dpd.co.uk/esgServer/shipping/shipment/_/parcel/',
					req_cookie = httpsync.get(url_dpd_cookie+parameters_request_cookie),
					res_cookie = req_cookie.end();

			if (res_cookie.statusCode !==200){
				throw ERROR_RESPONSE_NOT_200;
			}
			//get the file sended, parse it to JSON and get the obj attribute
			var data_cookie= JSON.parse(res_cookie.data.toString('UTF-8')).obj;

			if(data_cookie.totalResults===0){//if there is no totalresults, thy havent found our request
				throw ERROR_NOT_FOUND;
			}
			//search in this file for the cookie sesion, we need to make another http requests
			var cookie_session = data_cookie.searchSession;

			//request the json file with all the information of our tracking number and cookie
			var parameters_json = '?'+ querystring.stringify({ parcelCode: tracking_number});
			var url_dpd = 'http://www.dpd.co.uk/esgServer/shipping/delivery/',
					req = httpsync.request({
						url: url_dpd +parameters_json,
						method: 'GET',
						headers: {
								cookie: 'tracking='+cookie_session
						}
					});
			var res = req.end();

			if (res.statusCode !==200){
				throw ERROR_RESPONSE_NOT_200;
			}

			var json_response = res.data.toString('UTF-8');//get the JSON file from the asnwer

			//parse it to JSON and get the trackingEvents
			var json_result = JSON.parse(json_response);

			//if response dont have any trackingEvent
			if(json_result.obj.trackingEvent === undefined || json_result.obj.trackingEvent.length===0){
				throw ERROR_NOT_FOUND;
			}
			var events_array = json_result.obj.trackingEvent;
			var rough_date, date, location, meesage, $, checkpoints_array = [];
			for(var k in events_array) {
				rough_date = events_array[k].trackingEventDate;
				date =rough_date.substring(0,rough_date.indexOf('.'));//take off the last 5 digits
				location =events_array[k].trackingEventLocation;
				message = events_array[k].trackingEventStatus;
				message = message.indexOf('<')!==-1? //if message has html code
					cheerio(events_array[k].trackingEventStatus).text()://take off it
						message;// if not, let it like before
				message = functions.deleteDoubleSpaces(message).trim();//delete double spaces
				//add into array
				checkpoints_array.push(functions.createCheckpointItem(location,message,date));
			}
			checkpoints_array = functions.sortJsonByDate(checkpoints_array);
			tracking_result.checkpoints= checkpoints_array;

			return tracking_result;

		};
	}

	module.exports = new Courier();
}());
Courier = require('./index');


// var result = Courier.usps('9400109699939938223564');
// console.log(result);
// var result = Courier.usps('9374889949033131111143');
// console.log(result);
// var result = Courier.usps('9405509699939943080223');
// console.log(result);
// var result = Courier.usps('9400109699939938223565');
// console.log(result);
// var result = Courier.hkpost('RC933607107HK');
// console.log(result);
// var result = Courier.hkpost('RT224265042HK');
// console.log(result);
// var result = Courier.hkpost('LK059460815HK');
// console.log(result);
// var result = Courier.hkpost('RC933607103HK');
// console.log(result);
  var result = Courier.dpduk('05167019264110');
console.log(result);
// var result = Courier.dpduk('15501498140350');
// console.log(result);
// var result = Courier.dpduk('15501733652085');
// console.log(result);
// var result = Courier.dpduk('07081002031105O');
// console.log(result);
// //not found
//  var result = Courier.dpduk('1550237026498N');//quito el 9 de antes de la N
// console.log(result);
