module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // uglify js压缩任务配置
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd")%> */\n'
      },
      build: {
        src: 'src/Dom.js',
        dest: 'target/Dom.min.js'
      }
    }
  });

  // 加载 uglify 任务插件
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // 注册默认执行任务列表
  grunt.registerTask('default', ['uglify']);
};