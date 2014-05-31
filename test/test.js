var should = require('should'),
	_ = require('underscore'),
	Courier = require('../lib/index');
	Functions = require('../lib/functions');

describe('Test: .is', function() {

	// Courier: http://www.usps.com
	// Hints: You can apply the API from their web site
	// Time need: less than an hour if you have the api key

	describe('Track @ usps(\'9405903699300184125060\')', function() {

		var usps = {
			checkpoints: [
				{
					country_name: 'FREDERIKSTED',
					message: 'Delivered',
					checkpoint_time: '2014-05-16T12:00:00'
				},
				{
					country_name: 'FREDERIKSTED',
					message: 'Out for Delivery',
					checkpoint_time: '2014-05-16T09:26:00'
				},
				{
					country_name: 'FREDERIKSTED',
					message: 'Sorting Complete',
					checkpoint_time: '2014-05-16T09:16:00'
				},
				{
					country_name: 'FREDERIKSTED',
					message: 'Arrival at Post Office',
					checkpoint_time: '2014-05-15T15:22:00'
				},
				{
					country_name: '',
					message: 'Electronic Shipping Info Received',
					checkpoint_time: '2014-05-13T00:00:00'
				}
			]
		};
		it('Expect return true', function() {
			var result = Courier.usps('9405903699300184125060');
			result.should.eql(usps);
		});
	});
	describe('Track @ usps(\'9400109699939938223564\')', function() {

		var usps = {
			checkpoints: [
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Delivered',
					checkpoint_time: '2014-05-29T14:52:00'
				},
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Out for Delivery',
					checkpoint_time: '2014-05-29T10:11:00'
				},
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Sorting Complete',
					checkpoint_time: '2014-05-29T10:01:00'
				},
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Arrival at Post Office',
					checkpoint_time: '2014-05-29T09:52:00'
				},
				{
					country_name: 'BETHPAGE',
					message: 'Depart USPS Sort Facility',
					checkpoint_time: '2014-05-29T03:35:00'
				},
				{
					country_name: 'BETHPAGE',
					message: 'Processed through USPS Sort Facility',
					checkpoint_time: '2014-05-28T13:33:00'
				},
				{
					country_name: 'LINTHICUM HEIGHTS',
					message: 'Depart USPS Sort Facility',
					checkpoint_time: '2014-05-27T22:21:00'
				},
				{
					country_name: 'LINTHICUM HEIGHTS',
					message: 'Processed at USPS Origin Sort Facility',
					checkpoint_time: '2014-05-27T22:17:00'
				},
				{
					country_name: 'HANOVER',
					message: 'Accepted at USPS Origin Sort Facility',
					checkpoint_time: '2014-05-27T21:02:00'
				},
				{
					country_name: '',
					message: 'Electronic Shipping Info Received',
					checkpoint_time: '2014-05-26T00:00:00'
				}
			]
		};
		it('Expect return true', function() {
			var result = Courier.usps('9400109699939938223564');
			result.should.eql(usps);
		});
	});
	describe('Track @ usps(\'9374889949033131111143\')', function() {

		var usps = {
			checkpoints: [
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Delivered',
					checkpoint_time: '2014-05-27T14:44:00'
				},
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Out for Delivery',
					checkpoint_time: '2014-05-27T09:58:00'
				},
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Sorting Complete',
					checkpoint_time: '2014-05-27T09:48:00'
				},
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Arrival at Post Office',
					checkpoint_time: '2014-05-27T07:24:00'
				},
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Acceptance',
					checkpoint_time: '2014-05-27T05:26:00'
				},
				{
					country_name: '',
					message: 'Electronic Shipping Info Received',
					checkpoint_time: '2014-05-27T00:00:00'
				}
			]
		};
		it('Expect return true', function() {
			var result = Courier.usps('9374889949033131111143');
			result.should.eql(usps);
		});
	});
	describe('Track @ usps(\'9405509699939943080223\')', function() {

		var usps = {
			checkpoints: [
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Delivered',
					checkpoint_time: '2014-05-28T13:21:00'
				},
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Out for Delivery',
					checkpoint_time: '2014-05-28T09:31:00'
				},
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Sorting Complete',
					checkpoint_time: '2014-05-28T09:21:00'
				},
				{
					country_name: 'SPRINGFIELD GARDENS',
					message: 'Arrival at Post Office',
					checkpoint_time: '2014-05-28T05:41:00'
				},
				{
					country_name: 'BETHPAGE',
					message: 'Depart USPS Sort Facility',
					checkpoint_time: '2014-05-28T04:23:00'
				},
				{
					country_name: 'BETHPAGE',
					message: 'Processed at USPS Origin Sort Facility',
					checkpoint_time: '2014-05-27T23:57:00'
				},
				{
					country_name: '',//where they got 16:45???
					message: 'Electronic Shipping Info Received',
					checkpoint_time: '2014-05-27T00:00:00'
				},
				{
					country_name: 'GREENLAWN',
					message: 'Acceptance',
					checkpoint_time: '2014-05-27T16:44:00'
				}
			]
		};
		it('Expect return true', function() {
			var result = Courier.usps('9405509699939943080223');
			result.should.eql(usps);
		});
	});
	// Courier: http://www.hongkongpost.com/
	// Hints: There is no official API from hongkongpost, but you may use web or other method to get the result easily.
	// Time need: less than an hour if you find the correct way

	describe('Track @ hkpost(\'RC933607107HK\')', function() {

		var hkpost = {
			checkpoints: [
				{
					country_name: 'IT',
					message: 'The item (RC933607107HK) was in transit within its destination on 27-May-2014.',
					checkpoint_time: '2014-05-27T00:00:00'
				}
			]
		};
		it('Expect return true', function() {
			var result = Courier.hkpost('RC933607107HK');
			result.should.eql(hkpost);
		});
	});

		describe('Track @ hkpost(\'RT224265042HK\')', function() {

			var hkpost = {
				checkpoints: [
					{
						country_name: 'TH',
						message: 'The item (RT224265042HK) was delivered on 28-May-2014.',
						checkpoint_time: '2014-05-28T00:00:00'
					}
				]
			};
			it('Expect return true', function() {
				var result = Courier.hkpost('RT224265042HK');
				result.should.eql(hkpost);
			});
		});

			describe('Track @ hkpost(\'LK059460815HK\')', function() {

				var hkpost = {
					checkpoints: [
						{
							country_name: 'US',
							message: 'The item (LK059460815HK) was delivered on 27-May-2014.',
							checkpoint_time: '2014-05-27T00:00:00'
						}
					]
				};

		it('Expect return true', function() {
			var result = Courier.hkpost('LK059460815HK');
			result.should.eql(hkpost);
		});
	});

	describe.skip('Track @ dpduk(\'15502370264989N\')', function() {
		// Courier: http://www.dpd.co.uk
		// Hints: Not that easy, if you can't find the magic in the cookies
		// Time need: We spent two days to dig out the magic. Once you know it, can be done within 2 hours.

		var dpduk = {'checkpoints': [
			{
				country_name: 'Hub 3 - Birmingham',
				message: 'We have your parcel, and it\'s on its way to your nearest depot',
				checkpoint_time: '2014-01-08T22:33:50'
			},
			{
				country_name: 'Hub 3 - Birmingham',
				message: 'We have your parcel, and it\'s on its way to your nearest depot',
				checkpoint_time: '2014-01-08T22:34:58'
			},
			{
				country_name: 'Hub 3 - Birmingham',
				message: 'Your parcel has left the United Kingdom and is on its way to Saudi Arabia',
				checkpoint_time: '2014-01-09T03:56:57'
			},
			{
				country_name: 'United Kingdom',
				message: 'The parcel is in transit on its way to its final destination.',
				checkpoint_time: '2014-01-09T22:34:00'
			},
			{
				country_name: 'Bahrain',
				message: 'Your parcel has arrived at the local delivery depot',
				checkpoint_time: '2014-01-10T09:39:00'
			},
			{
				country_name: 'Bahrain',
				message: 'The parcel is in transit on its way to its final destination.',
				checkpoint_time: '2014-01-10T13:45:00'
			},
			{
				country_name: 'Bahrain',
				message: 'The parcel is in transit on its way to its final destination.',
				checkpoint_time: '2014-01-12T13:17:00'
			},
			{
				country_name: 'Saudi Arabia',
				message: 'Your parcel has arrived at the local delivery depot',
				checkpoint_time: '2014-01-14T06:30:00'
			},
			{
				country_name: 'Saudi Arabia',
				message: 'Your parcel is at the local depot awaiting collection',
				checkpoint_time: '2014-01-14T21:18:00'
			},
			{
				country_name: 'Saudi Arabia',
				message: 'Your parcel is on the vehicle for delivery',
				checkpoint_time: '2014-01-15T08:34:00'
			},
			{
				country_name: 'Saudi Arabia',
				message: 'The parcel has been delivered, signed for by BILAL',
				checkpoint_time: '2014-01-15T19:23:00'
			}
		]
		};

		it('Expect return true', function() {
			var result = Courier.dpduk('15502370264989N');
			result.should.eql(dpduk);
		});
	});

});
