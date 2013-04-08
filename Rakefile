
desc "Compile minified and obfuscated version of factory.js and json2.js"
task :dist do
  require 'uglifier'
  %w{lib/json2.js src/factory.js}.each do |src_file|
    Uglifier.compile(File.read(src_file)).tap do |js|
      mkdir_p 'dist', verbose: false
      chdir 'dist', verbose: false do
        file_name = src_file.split("/")[1]
        $stdout << "Writing minified #{file_name}.\n"
        File.open(file_name, 'w+') do |f|
          f.write(js)
        end
        $stdout << "Done!\n"
      end
    end
  end
end

desc "Compile src and dependency, json2.js; prepend json2.js"
task package: :dist do
  dest_file = "dist/factory_build.js" 
  $stdout << "Starting my run!\n"

  rm_f dest_file

  $stdout << "Writing to #{dest_file}.\n"

  File.open(dest_file, 'a+') do |f|
    %w{dist/json2.js dist/factory.js}.each do |file_name|
      $stdout << "Concatenating #{file_name} to #{dest_file}.\n"
      f.write(File.read(file_name))
      $stdout << "Done!\n"
    end
  end

  $stdout << "Finished my run!\nPackage {json2.js, factory.js} available at #{dest_file}.\n"
end

task :clean do
  rm_rf "dist"
end

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

task default: 'jasmine:ci'

