# Generating API Doc for MMIR

For the creation of the API documentation of the MMIR framework, jsdoc can be used.

The script file `create_doc.bat` creates doc either for jsdoc2 or jsdoc3


    PROJECT_PATH\doc\api_doc2		(for jsdoc2)
    PROJECT_PATH\doc\api_doc3		(for jsdoc3)
  
where `create_doc.bat X2` creates the jsdoc2 files and `create_doc.bat X3` creates jsdoc3.

See also the `mmir-build.xml` target `doc` and the settings for `jsDocVersion` 
in `mmir-build.settings`. E.g. you can invoke the doc target via ant with 
`ant -f mmir-build.xml doc`

## Requirements

The ANT script in `PROJECT_PATH\doc\node_modules` should install all necessary
resources by default. But if directory

`PROJECT_PATH\doc\node_modules`

is missing, you should run `npm install` in `PROJECT_PATH\doc` in order to install

 * jsdoc3
 * jsdoc2 (node-jsdoc-toolkit)
 * template docstrap for jsdoc3


(you should use the latest jsdoc3 version >= v3.4.0-dev)


jsdoc3 is set to use the [docstrap][1] template by default, which is
automatically installed when `npm install` is run in the doc-dir.


If you want to change templates, edit `create_doc.bat` and change variable
`TEMPLATE` for jump-marks `:jsdoc2` and `:jsdoc3` (and TEMPLATEDIR if necessary).


## Notes

Note that the jsdoc3 generation uses some custom plugins in `\doc\plugins\` which are
referenced via the jsdoc3 configuration file `\doc\conf-jsdoc3.json` (if you do not used
`create_doc.bat` you can use the command line parameter `-c CONFIG` of jsdoc3 for using
the configuration file; take care that the working directory from which you call jsdoc3
corresponds to the configuration in `confi-jsdoc2.json`).

## Running on *nix

While not tested, you can try `create_doc2.sh` or `create_doc3.sh` for creating jsdoc2
or jsdoc3 respectively.

[1]: https://github.com/terryweiss/docstrap
