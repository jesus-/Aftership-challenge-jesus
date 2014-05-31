
var httpsync = require('httpsync'),//make request synchronous
		functions = require('./functions'),//personal functions
		querystring = require('querystring'),//create strings for send body in forms
		cheerio = require('cheerio');//scraping a web page

(function() {

	function Courier() {
/*
	Function USPS
	For get the information, just request to the API the information,
	it will return an XML.
*/
		this.usps = function(tracking_number) {

			var tracking_result = {},//variable send back JSON with events
					userId ='230ASFAS3759',//user ID de USPS
					api_USPS = 'http://production.shippingapis.com/ShippingAPITest.dll', //url API
					name_api =	'TrackV2',
					XML_request = '<TrackFieldRequest USERID="'+userId+'"><TrackID ID="'+tracking_number+
					'"></TrackID></TrackFieldRequest>',
					parameters_request = '?'+ querystring.stringify({ API: name_api, XML: XML_request});

			var req = httpsync.get(api_USPS+parameters_request),//make request to the API
					res = req.end(),
					xml_response = res.data.toString('UTF-8');//Xml response from our petition

			var $ = cheerio.load(xml_response, { //load response in cheerio
				normalizeWhitespace: true,
				xmlMode: true
			});

			if ($('Error').length){//if there is a field with the name Error
				var description = $('Error').children('Description').text();//get description
				throw description; //trhow an exception with the description of the error
			}else{
				// get the iformation from the xml_response
				var ArrayCheckpoints = [], eventName, eventTime, hour12, hour24, min,
				typeHour, time, eventDate, coma,day, place;
				//get all the elements TrackSummary and TrackDetail, and iterate through them
				$('TrackSummary, TrackDetail').each(function(i, elem) {

					eventName='',eventTime='',time='',eventDate='',day='',place='';

					eventName =  $(this).children('Event').text();
					//	transform time from this format 2:57 pm to 14:57:00
					eventTime = $(this).children('EventTime').text();
					time=functions.parseHourUSPS(eventTime);
					//	transform day from this format January 15, 2014 to 2014-01-15
					eventDate = $(this).children('EventDate').text();
					day = functions.parseDayUSPS(eventDate);
					//get country, in this case is place
					place = $(this).children('EventCity').text();

					ArrayCheckpoints.push(functions.createCheckpointItem(place,eventName,day+time));

				});
				tracking_result.checkpoints= ArrayCheckpoints;
			}
			return tracking_result;

		};

		/*
			Function Hong Kong post
			For get the information, request the hmtl to the page, and make a scraping for
			get the information we need.
		*/
		this.hkpost = function(tracking_number) {
			var tracking_result = {}, // save your result to this object
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

			var res = req.end(),//make the request
					html_response = res.data.toString('UTF-8');//we get a html page to scrape
			//scrape the web page to get the important information
			var $ = cheerio.load(html_response),
					div_container = $('#clfContent').html();//get div with content
			if (!$('span.textNormalBlack').length){//if doesnt have the country in bold
				throw 'Track number doesn\'t found';//throw error
			}
			var country_html = $('span.textNormalBlack').parent().html(),//get country html
					message = functions.substringSkipStart(country_html,'<br',div_container),
					message_formatted = functions.removeLineBreaks($(message).text()).trim(),
					country = functions.substringSkipStart('</span> -','',country_html).trim();
					country_code = functions.getCodeCountry(country),//get the country code
					date_rough = functions.substringSkipStart(' on ','.',message_formatted).trim();
					console.log(date_rough);
			//transform from this 28-May-2014 to this 2013-12-11T00:00:00
			var date = functions.parseDayHKPost(date_rough)+'T00:00:00';

			var ArrayCheckpoints = [];
			//insert checkpoint generate
			ArrayCheckpoints.push(functions.createCheckpointItem(country_code,message_formatted,date));
			tracking_result.checkpoints= ArrayCheckpoints;

			return tracking_result;

		};

		/*
			Function DPDUK
			We need a cookie for make a request of the information, so first we make
			a request to a direction and get the cookie, and then make the proper request,
			it will response a Json file, we barely need to process the information
		*/
		this.dpduk = function(tracking_number) {

			var tracking_result = {}, // checkpoints send back
					url_dpd_js='http://www.dpd.co.uk/esgServer/shipping/shipment/_/parcel/?filter=id&searchCriteria=deliveryReference='+
					tracking_number,
					req_js = httpsync.get(url_dpd_js),
					res_js = req_js.end();
			// console.log(res_js);
			var data_search = res_js.data.toString('UTF-8'),//get the file sended
					//search in this file for the cookie sesion
					cookie_session = data_search.substring(data_search.indexOf('searchSession":"')+16,data_search.indexOf('"}}'));

			var url_dpd = 'http://www.dpd.co.uk/esgServer/shipping/delivery/?parcelCode='+tracking_number,
					req = httpsync.request({//request with the cookie session
						url: url_dpd,
						method: 'GET',
						headers: {
								cookie: 'tracking='+cookie_session
						}
					});
			var res = req.end(),
					json_response = res.data.toString('UTF-8');//get the JSON file from the asnwer

			var json_result = JSON.parse(json_response),//parse it to JSON
					ArrayCheckpoints = [];
			var rough_date, date;
			for(var k in json_result) {
				rough_date = json_result[k].trackingEventDate;
				date =raw_date.substring(0,rough_date.indexOf('.'));//take off the last 5 digits
				ArrayCheckpoints.push(functions.createCheckpointItem(json_result[k].trackingEventLocation,json_result[k].trackingEventStatus,date));
			}
			ArrayCheckpoints = functions.sortJsonByDate(ArrayCheckpoints);
			tracking_result.checkpoints= ArrayCheckpoints;

			return tracking_result;

		};
	}

	module.exports = new Courier();
}());
Courier = require('./index');

var result = Courier.hkpost('RC933607104HK');
console.log(result);
// var result = Courier.hkpost('RC933607107HK');
// console.log(result);
// var result = Courier.hkpost('LK059460815HK');
// console.log(result);

//  var result = Courier.dpduk('15502370264989N');

// var result = Courier.usps('9400109699939938223564');
// console.log(result);
// var result = Courier.usps('9374889949033131111143');
// console.log(result);
// var result = Courier.usps('9405509699939943080223');
// console.log(result);
// var result = Courier.usps('9400109699939938223565');
// console.log(result);
