/*
 After you have changed the settings at "Your code goes here",
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {

    grunt.initConfig({
      responsive_images: {
        dev: {
          options: {
            engine: 'im',
            sizes: [ 
              {
                width: 300,
                quality: 60,
                suffix: '_small'
              },
              {
                width: 600,
                quality: 70,
                suffix: '_medium_2x'
              },
              {
                width: 800,
                quality: 70,
                suffix: '_large_2x'
              }
            ]
          },
          /*
          You don't need to change this part if you don't change
          the directory structure.
          */
          files: [{
            expand: true,
            src: ['*.{gif,jpg,png}'],
            cwd: 'src/img',
            dest: 'src/images'
          }]
        }
      },
  
      /* Clear out the images directory if it exists */
      clean: {
        dev: {
          src: ['src/images'],
        },
      },
  
      /* Generate the images directory if it is missing */
      mkdir: {
        dev: {
          options: {
            create: ['src/images']
          },
        },
      },
  
      /* Copy the "fixed" images that don't go through processing into the images/directory */
      copy: {
        dev: {
          files: [{
            expand: true,
            src: 'src/fixed/*.{gif,jpg,png}',
            dest: 'src/images/'
          }]
        },
      },
    });
    
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.registerTask('default', ['clean', 'mkdir', 'copy', 'responsive_images']);
  
  };
  