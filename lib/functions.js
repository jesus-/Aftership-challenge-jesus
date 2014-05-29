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
   }
};
