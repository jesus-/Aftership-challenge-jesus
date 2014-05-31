module.exports = {
  /*Receive the month in letters  'January'
    Returns the month in number '1'
    If not found, return 00
  */
  getMonthFromString: function (month){
    month = month.toLowerCase();
    var month_large = ['january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'],
      month_small =['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug',
      'sep', 'oct', 'nov', 'dec'];

    var idx = month_large.indexOf(month)!==-1? month_large.indexOf(month)+1:
      month_small.indexOf(month)!==-1? month_small.indexOf(month)+1: 0;

    return idx < 10 ? '0' + idx : idx;
  },
 /*Receive the hour with AM, PM
   Returns the hour with 24 hour format
 */
 hourTo24h : function(hour,type){
   type=type.toLowerCase().trim();
   var hours12Format = ['01','02','03','04','05','06','07','08','09','10','11','12'],
       hours12Format2 = ['1','2','3','4','5','6','7','8','9','10','11','12'],
       index1 = hours12Format.indexOf(hour),//exist in the array?
       index2 = hours12Format2.indexOf(hour),//exist in the array?
       index = index1 !==-1? index1:index2;
   //check all items send correctly
   if (type!=='am' && type!=='pm')//type is not am or pm
     {throw 'function hourTo24h only accept pm/am as types, value: '+type;}
   if(index===-1)//the hour is not accepted
     {throw 'function hourTo24h hour format not accepted, value: '+hour;}

   //parse the hour
   var new_hour = parseInt(hour);
   if(type === 'pm' && new_hour<12){ new_hour = new_hour+12;}
   if(type === 'am' && new_hour==12){new_hour = new_hour-12;  }

   if((''+new_hour).length ===1){
     new_hour = '0' + new_hour;
   }

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

  substringSkipStart: function(start,end,string_container){
     var position_to_start = string_container.indexOf(start)+start.length;

     if(string_container.indexOf(start)===-1){ //if start is not in container, return ''
       return '';
     }else if(end ===''){ // if end is '', return till the end of container
       return string_container.substring(position_to_start).trim();
     }else if(string_container.indexOf(end)===-1){// if end is not in container, return till the end of container
       return string_container.substring(position_to_start).trim();
     }else{
       var position_end = string_container.indexOf(end,position_to_start);
       return string_container.substring(position_to_start,position_end).trim();
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
  },
/*Receive a object Json, the elements are checkpoints
  Return the object Json sorted
*/
  sortJsonByDate: function(objJson){
    return objJson.sort(function (a,b){
      if(a.attributes.checkpoint_time == b.attributes.checkpoint_time){
        return 0;
      }else if(a.attributes.checkpoint_time < b.attributes.checkpoint_time){
        return -1;
      }else if(a.attributes.checkpoint_time > b.attributes.checkpoint_time){
        return 1;
      }
    });
  },
/*Receive a hour with format: 0:00 pm
  Return hour format: T14:57:00
*/
  parseHourUSPS: function(oldHour){
    var hour12, hour24, min, typehour, time;
    hour12 = oldHour.substring(0,oldHour.indexOf(':'));//hour 12h format
    min = this.substringSkipStart(':',' ',oldHour);
    typeHour = oldHour.substring(oldHour.length-3);
    try{hour24 =  this.hourTo24h(hour12,typeHour);}
    catch(error){//if there is an error, we print it, and make the hour 00.
      console.log(error);
      hour24='00';
      min='00';
    }
    time = 'T'+ hour24+':'+min+':00';//hour min and seg

    return time;
  },
  /*Receive a date with format: January 15, 2014
    Return date format: 2014-01-15
  */
  parseDayUSPS: function(oldDate){
    var coma,day;
    coma =oldDate.indexOf(',');
    day= oldDate.substring(coma+2,coma+2+4)+'-'+//year
      this.getMonthFromString(oldDate.substring(0,oldDate.indexOf(' ')))+'-'+//month
      oldDate.substring(oldDate.indexOf(' ')+1,coma);//day

      return day;
  },
  /*Receive a date with format: 28-May-2014
    Return date format: 2013-12-11
  */
  parseDayHKPost: function(oldDate){
    var day = oldDate.substring(0,2),
        month = this.getMonthFromString(this.substringSkipStart('-','-',oldDate)),
        year = oldDate.substring(oldDate.length-4);

    return year+'-'+month+'-'+day;
  }

};
