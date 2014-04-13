'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		mocha: {
			test: {
				src: ['test/**/*.js']
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			lib: {
				src: ['lib/**/*.js']
			},
			test: {
				src: ['test/**/*.js']
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			lib: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib', 'mocha']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'mocha']
			},
		},
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task.
	grunt.registerTask('default', ['jshint', 'mocha']);

};
