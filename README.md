[MMIR Starter Kit][0]
===========

![MMIR](https://github.com/mmig/mmir-starter-kit/blob/master/platforms/android/res/drawable-xhdpi/icon.png "MMIR logo")

The MMIR StarterKit is a small example application for the MMIR framework that can run locally in an (HTML5 capable)
internet browser, and using the [Cordova framework][1], it can also be run as an Android app.

For more detailed information on the MMIR framework see documentation at the [MMIR repository][8]

WARINING: _this project includes resources from [MMIR-lib][4] at `www/mmirf/` and
          resources from [MMIR-tooling][5] at `build/`. Beware, that the files used in this
          example project may not be the most current version of these resources.
          For your own MMIR-based applications you should use the resources from
          [MMIR-lib][4] and [MMIR-tooling][5] directly._

----

#### Details

This is an example application that uses the [MMIR framework][4] (included as GIT subtree reference in ```/www/mmirf```).

Basic integration into the Cordova 3 build process is done by including the [MMIR tools][5]
(as GIT subtree reference in ```/build```; note: running the default ```ant``` task in within the build/tool directory will
copy the build-resources into the projects root directory).

Activated platforms _(for Cordova 3.x)_:
 * `android`
 * 


##### Prerequisites

Installed Cordova 3.x environment (see Cordova documentation on CLI based development for more details).

##### Additional Prerequisites: Android

The StarerKit includes `android` as target platform for Cordova. However, you need to have the the 
development tools for Android installed, if you want to build and run the application on Android.

##### Build

After checking out the the project, you need to run ```cordova build``` within the project directory. 


###### Platform: Android

For platform-specific development, the Android projects can be imported into Eclipse (see
Cordova's platform guides for Android for prerequisites etc.):

 * select ```import...``` and then ```Existing Android Code Into Workspace```
 * then select the sub-directory ```/platforms/android```

This will import 2 projects: the Cordova-library project and the project for the MMIR StarterKit.

The imported StarterKit project contains a reference to ```/www``` in the root directory of the project,
along with a copy in its own ```/platform/android/assets/www``` directory (NOTE: by default, the Eclipse 
project is configured, to hide this copy).
If you want to make platform-independent changes, you should use the referenced "directory" ```/www```
in the project's root.
After changing files, you need to run ```cordova build``` in order to propagate the changes
from the ```/www``` directory to the ```/platform/android/assets/www``` directory.


###### Platform: xxxx

TODO

----

#### License
If not stated otherwise, the code, resource files etc. is provided under the MIT license (see license file).

[0]: https://github.com/mmig/mmir-starter-kit
[1]: http://cordova.apache.org/
[4]: https://github.com/mmig/mmir-lib
[5]: https://github.com/mmig/mmir-tooling
[6]: https://github.com/mmig/mmir-plugin-scionqueue
[8]: https://github.com/mmig/mmir