module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	
	concat: {
	    options: {
			//定义一个用于插入合并输出文件之间的字符
			separator: ';'
		},
	
		dist:{
			src:['<%= pkg.version %>/src/base/base.js', '<%= pkg.version %>/src/base/qatrix.js', '<%= pkg.version %>/src/base/util.js', '<%= pkg.version %>/src/mods/messenger.js', '<%= pkg.version %>/src/abc.js'],
			dest: '<%= pkg.version %>/abc-debug.js',
		}
	
	},
	
    uglify: {
		options: {
			//生成一个banner注释并插入到输出文件的顶部
			banner: '/*! <%= pkg.name %> version:<%= pkg.version %>  build time:<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
		},
		dist:{
			src:['<%= pkg.version %>/abc-debug.js'],
			dest: '<%= pkg.version %>/abc.js',
		}
    }
  });
  
  
  grunt.loadNpmTasks('grunt-contrib-concat');  
  grunt.loadNpmTasks('grunt-contrib-uglify');
	
  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);

};