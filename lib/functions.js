module.exports = {
  /*Receive the month in letters  'January'
    Returns the month in number '1'
  */
  getMonthFromString: function (month){
    var idx = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'].indexOf(month) + 1;

    return idx < 10 ? '0' + idx : idx;
  },
 /*Receive the hour with AM, PM
   Returns the hour with 24 hour format
 */
 hourTo24h : function(hour,type){

   var new_hour = parseInt(hour);
   if(type === 'pm' && new_hour<12){ new_hour = new_hour+12;}
   if(type === 'am' && new_hour==12){new_hour = new_hour-12;  }
   return new_hour;
 },
/*Receive country_name, message and checkpoint_time
  Returns a Json object
*/
 createCheckpointItem: function(country_name,message,checkpoint_time){

   item = {};
   item.country_name =country_name;
   item.message = message;
   item.checkpoint_time = checkpoint_time;

   //console.log(item);
   return item;
 },
/*Receive a decritpion error
  Returns a Json object error
*/
  createErrorJson: function(description){

   item = {};
   item.error =description;
   //console.log(item);
   return item;
 },
 /*Receive a xml_string and and element to get the content of
   Returns the element of that space
 */
   getElementXML: function(element,xml_string){
     var element_start = '<'+element+'>';
     var element_end = '</'+element+'>';
     var element_content = xml_string.substring(xml_string.indexOf(element_start)+element_start.length,
     xml_string.indexOf(element_end));

     return element_content;
   },
   /*Receive 3 strings, the start, the end, and the container
     Return the inormation of the container betwwen start and end
     if end is empty, return till the end of the container
   */
   substringSkipStart: function(start,end,string_container){
     var position_to_start = string_container.indexOf(start)+start.length;
     if(end ===''){
       return string_container.substring(position_to_start);
     }
     else{
       var position_end = string_container.indexOf(end,position_to_start);
       return string_container.substring(position_to_start,position_end);
     }
   },
   /*Receive a string
     Return the string without line breaks
   */
   removeLineBreaks :function(string_format){
     var string_formated = string_format.replace(/(\r\n|\n|\r)/gm,'');
     return string_formated;
   },
/*Receive a path with a name for a file, and the data you want to write
  Doesn't have a return, but write in the console if it was correct
*/
   writeFile: function(name_path,data){
     var fs = require('fs');
      fs.writeFile(name_path, data, function(err) {
          if(err) {
              console.log(err);
          } else {
              console.log('The file was saved!');
          }
      });

   },
/*Receive a country
  Return the code Alpha2
  Coutries with exceptions:
    United States of America => United States
  Check rest of the list of hongkongpost
*/
   getCodeCountry: function(country){
     var country_data = require('country-data');//get code between countries
     var lookup = country_data.lookup;
     var country_code = lookup.countries({name: country})[0] !== undefined ?
       lookup.countries({name: country})[0].alpha2 :
         (country==='United States of America' ?
           lookup.countries({name: 'United States'})[0].alpha2 :
             'Country not found');
    return country_code;
   }
};
