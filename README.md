mmir-starter-kit-ionic
===========

Experimental integration of the [MMIR framework][0] in [ionic][1] v2 (_typescript_).

# Prerequisites

The following lists software and hardware prerequisites
for development, and for running the app.

 * installed Cordova CLI  
   `npm install -g cordova`  
   * version: `7.x`
 * installed Ionic framework  
   `npm install -g ionic`  
   * version: `>= 3.4.x`
 * installed Android SDK (ADK) / Android Studio  
   https://developer.android.com/studio/index.html
   * version: `Android SDK Build Tools version >= 26.x`

# Setup

#### Attention

 * __android sdk / gradle:__ currently the is a problem with integrating android's build system (`gradle`) into `cordova` properperly. If you get an error message that `gradle` could not be found:  
  * __option 1: fix cordova's detection mechanism:__
    * use this method, if you have `Android Studio` installed in a non-default location
    * open file `platforms/android/cordova/lib/check_reqs.js` and find implementation for function `module.exports.get_gradle_wrapper` (ca. line 96).
    * within the function, add the following code before `if (module.exports.isDarwin()) {...`, so that:  
    ```javascript
    ...
    var program_dir;//ORIGINAL LINE
	if( process.env['ANDROID_STUDIO_HOME']){
		 androidStudioPath = path.join(process.env['ANDROID_STUDIO_HOME'], 'gradle');
    } else
     if (module.exports.isDarwin()) {//ORIGINAL LINE
    ...
    ```
    * set the environment variable `ANDROID_STUDIO_HOME` to the path where you installed `Android Studio` (e.g. on *nix systems: `export=...`)
  * __option 2: separate installation of `gradle`__  
  install `gradle` into the default-location,so that cordova's build script will correctly detect its presence  
    https://gradle.org/install
  * __option 3: install `Android Studio` into default location__  
  install `Android Studio` into the default-location,so that cordova's build script will correctly detect its presence  
    https://developer.android.com/studio/index.html

#### Notes _(recommendations)_
 * for `cordova version 7.x.x` it recommended to disable auto-saving
    configuration changes (which was enabled by default in v7.x.x), i.e.  
      `cordova config set autosave false`            
    _auto-saving_ may cause problems due to the fact that a.t.m.
      `cordova` (`plugin.xml`) and `npm` (`package.json`) interpret
    file paths differently (and auto-saving will write the same
    pahts into both configuration files).

#### Build Setup Steps
__0)__ _on *nix systems you may need to set the `executable` flag for the build script_  
    `hooks/before_prepare/build-mmir.js`  
  e.g. run  
    `chmod -R u+x hooks`

__1)__ before npm install

  - install Cordova CLI `npm install -g cordova`
  - install Ionic framework `npm install -g ionic`

__2)__ on project folder

  - `npm install` (in the project root folder)
  - `cordova prepare` (can be ignored if failed)
  - `ionic serve` or `ionic serve -b` (no browser loading)

## Project Structure

**NOTE:** Be aware that in difference to usual Cordova projects, the source files are located in `/src` and
not in `/www`. The `/www` directory contains generated files which will be overwritten on `build`ing the project.


# Testing (in Browser)

## Setup (Browser)

The app access a foreign domain, i.e. cross-origin protection must be disabled, in order for the web app to run in a browser.

For Chrome this can be accomplished by using the command-line option `--disable-web-security`. Note that there must be no other Chrome instance running (for the same user profile) for the command-line option to take effect, i.e. close all running instance of Chrome (or use a different user profile, see below).  
NOTE that you should also use a dedicated user-profile, in order to run this testing-instance
     of Chrome separetely from your "normal" Chrome instance, i.e. use command-line option `--user-data-dir=<path-to-testing-user-profile>`.


## Run (Browser)

for testing the app in the browser run
`ionic serve`  
which will start a local service, by default on `localhost:8000` (note the output on the console that will print the actual address that is used).

Changes in `src` will be automatically detected, compiled, and the served web page be updated.

# Testing (Android)

## Building / Running Android

run `ionic cordova build android` for building the Android APK

or `ionic cordova run android` for building the APK and installing it on the (first available) Android device.


[0]: https://github.com/mmig/mmir-lib
[1]: https://ionicframework.com
