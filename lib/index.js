(function() {
	function Courier() {
		this.usps = function(tracking_number) {
			var tracking_result = {}; // save your result to this object

			console.log(tracking_number);

			// do your job here
			return tracking_result;

		};

		this.hkpost = function(tracking_number) {
			var tracking_result = {}; // save your result to this object

			console.log(tracking_number);

			// do your job here
			return tracking_result;

		};

		this.dpduk = function(tracking_number) {
			var tracking_result = {}; // save your result to this object

			console.log(tracking_number);

			// do your job here
			return tracking_result;

		};
	}

	module.exports = new Courier();
}());

