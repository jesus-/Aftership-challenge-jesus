var should = require('should'),
  _ = require('underscore'),
  Functions = require('../lib/functions');

describe('Test: .is', function() {

/*
Test  fucntions
*/
  describe('@getMonthFromString', function() {
    var month = '00';
    it('Expect return 00 when month does not match', function() {
      var result = Functions.getMonthFromString('notGoodMonth');
      result.should.eql(month);
    });
  });

  describe('@getMonthFromString', function() {
    var month = '05';
    it('Expect return 05 for May', function() {
      var result = Functions.getMonthFromString('May');
      result.should.eql(month);
    });
  });


  describe('@hourTo24h', function() {
    it('Expect throw error, hour not accepted', function() {
      try{
        var result = Functions.hourTo24h('13','pm');
      }catch(err){
        err.should.eql('function hourTo24h hour format not accepted, value: 13');
      }
    });
  });


  describe('@hourTo24h', function() {
    it('Expect throw error, type not accepted', function() {
      try{
        var result = Functions.hourTo24h('05','cd');
      }catch(err){
        err.should.eql('function hourTo24h only accept pm/am as types, value: cd');
      }
    });
  });

  describe('@hourTo24h', function() {

    var hour='17';
    it('Expect return 17', function() {
      var result = Functions.hourTo24h('05','pm');
      result.should.eql(hour);
    });
  });

  describe('@createCheckpointItem', function() {
    var checkpointItem ={
          country_name: 'test_country',
          message: 'test_message',
          checkpoint_time: 'test_time'
        };

    it('Expect equals', function() {
      var result = Functions.createCheckpointItem('test_country','test_message','test_time');
      result.should.eql(checkpointItem);
    });
  });

  describe('@substringSkipStart', function() {
    it('Expect text between start and end', function() {
        var result = Functions.substringSkipStart('start','end', 'start this is what we want end');
        result.should.eql('this is what we want');

    });
  });
    describe('@substringSkipStart', function() {
      it('Expect text from start, end does not exit in container', function() {
          var result = Functions.substringSkipStart('start','end', 'start this is what we want enou');
          result.should.eql('this is what we want enou');
      });
    });

  describe('@substringSkipStart', function() {
    it('Expect empty, start does not exist in container', function() {
        var result = Functions.substringSkipStart('start','end', 'star this is what we want enou');
        result.should.eql('');
    });
  });
  describe('@substringSkipStart', function() {
    it('Expect all the container, start and end are empty', function() {
        var result = Functions.substringSkipStart('','', 'star this is what we want enough');
        result.should.eql('star this is what we want enough');
    });
  });
  describe('@removeLineBreaks', function() {
    it('Expect string without line breaks', function() {
        var result = Functions.removeLineBreaks('this \r\nis fu\rll of \nbrea\nks');
        result.should.eql('this is full of breaks');
    });
  });
  describe('@getCodeCountry', function() {
    it('Expect CH', function() {
        var result = Functions.getCodeCountry('China');
        result.should.eql('CN');
    });
  });
  describe('@getCodeCountry', function() {
    it('Expect HK', function() {
        var result = Functions.getCodeCountry('Hong Kong');
        result.should.eql('HK');
    });
  });
  describe('@getCodeCountry', function() {
    it('Expect JP', function() {
        var result = Functions.getCodeCountry('Japan');
        result.should.eql('JP');
    });
  });
  describe('@getCodeCountry', function() {
    it('Expect US', function() {
        var result = Functions.getCodeCountry('United States of America');
        result.should.eql('US');
    });
  });
  describe('@getCodeCountry', function() {
    it('Expect US', function() {
        var result = Functions.getCodeCountry('United States');
        result.should.eql('US');
    });
  });

  describe('@parseHourUSPS', function() {
    it('Expect T15:34:00, hour 1 digit', function() {
        var result = Functions.parseHourUSPS('3:34 pm');
        result.should.eql('T15:34:00');
    });
  });
  describe('@parseHourUSPS', function() {
    it('Expect T15:34:00 hour 2 digits', function() {
        var result = Functions.parseHourUSPS('03:34 pm');
        result.should.eql('T15:34:00');
    });
  });
  /*Receive a date with format: January 15, 2014
    Return date format: 2014-01-15
  */

  describe('@parseDayUSPS', function() {
    it('Expect 2014-01-15', function() {
        var result = Functions.parseDayUSPS('January 15, 2014');
        result.should.eql('2014-01-15');
    });
  });

  describe('@parseDayUSPS', function() {
    it('Expect 2010-12-20', function() {
        var result = Functions.parseDayUSPS('Dec 20, 2010');
        result.should.eql('2010-12-20');
    });
  });

  describe('@parseDayHKPost', function() {
    it('Expect 2014-05-28', function() {
        var result = Functions.parseDayHKPost('28-May-2014');
        result.should.eql('2014-05-28');
    });
  });

  describe('@parseDayHKPost', function() {
    it('Expect 2010-12-20', function() {
        var result = Functions.parseDayHKPost('20-Dec-2010');
        result.should.eql('2010-12-20');
    });
  });
});
