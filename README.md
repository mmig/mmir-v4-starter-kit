MMIR Starter Kit
===========

<h1 style="color: red;">
DEPRECATED this is an outdated starter-kit that targets <code>MMIR</code> version 4.x - for current starter-kit go to <a href="https://github.com/mmig/mmir-starter-kit">mmir-starter-kit</a>
</h1>

```diff
- DEPRECATED this is an outdated starter-kit that targets MMIR version 4.x 
- for current starter-kit go to https://github.com/mmig/mmir-starter-kit
```

The [MMIR v4 Starter Kit][0] is a small example application for the MMIR framework that can run locally in an (HTML5 capable)
internet browser, and using the [Cordova framework][1], it can also be run as an Android app.

There is also a special branch that includes a graphical Grammar Editor (see branch `new-grammar-editor`'s [www/appTestSemantic][11] directory).


For a quick look, try the [online demos](#demo) (links below).


For more detailed information on the MMIR framework see documentation at the [MMIR repository][8]

WARINING: _this project includes resources from [MMIR-lib][4] at `www/mmirf/` and
          resources from [MMIR-tooling][5] at `build/`. Beware, that the files used in this
          example project may not be the most current version of these resources.
          For your own MMIR-based applications you should use the resources from
          [MMIR-lib][4] and [MMIR-tooling][5] directly._

----

#### Details

This is an example application that uses the [MMIR framework][4] (included as GIT subtree reference in `/www/mmirf`).

Basic integration into the Cordova 3 build process is done by including the [MMIR tools][5]
(as GIT subtree reference in `/build`; note: running the default `ant` task in within the build/tool directory will
copy the build-resources into the projects root directory).

Activated platforms _(for Cordova 5.x or later)_:
 * `android`
 *

----

##### Demo

###### StarterKit Online Demo
Try the online demo for the "browser environment" at the [demo page][9].

NOTE: At the moment, speech input in the "browser environment" only works for current versions of Chrome (> v25).

###### Grammer Editor Online Demo
There is also a demo page for the [grammar editor / tester][10] (for testing the grammar that is used for evaluating speech input).



----

##### Prerequisites

Installed Cordova 5.x - 7.x environment (see Cordova documentation on CLI based development for more details).

##### Additional Prerequisites: Android

The StarerKit includes `android` as target platform for Cordova. However, you need to have the the
development tools for Android installed, if you want to build and run the application on Android.

See the [Cordova documentation for the Android][12] platorm for more details.

##### Build

After checking out the the project, you need to run `cordova build` within the project directory.


###### Platform: Android


**NOTE** since Cordova 5, platform specific development for Android in Eclipse is not fully supported any more!
         _(you may use `Android Studio` instead)_


For platform-specific development, the Android projects can be imported into `Android Studio` (see
Cordova's platform guides for Android for prerequisites etc.):

 * select `Open ...`
 * then select the sub-directory `/platforms/android`

This will import 2 modules: the Cordova-library project and the project for the MMIR StarterKit.

The imported StarterKit project contains a reference to `assets/www`, which corresponds
to the `/platform/android/assets/www` project directory; this directory contains __copied__
resources from the project directory `/www`.  
If you want to make platform-independent changes, you should use the directory `/www`
in the project's root; beware that `cordova prepare` (and `build`, `run`) will overwrite the
contents of `/platform/android/assets/www` with the contents of `/www`.  
After changing files in `/www`, you need to run `cordova build` in order to propagate the changes
from the `/www` directory to the `/platform/android/assets/www` directory.

###### Platform: Browser (Optional)

 * install platform `browser` (no additional setup required):  
   `cordova platform add browser`

###### Platform: iOS (Optional)

[EXPERIMENTAL]

 * install platform `ios`:  
   `cordova platform add ios`
 * needs Nuance plugin for enabling speech recognition / synthesis:  
   `cordova plugin add https://github.com/mmig/mmir-plugin-speech-nuance`
 * modify `config.xml` with your Nuance credentials (see [mmir-plugin-speech-nuance][13] for more details)

----

#### License
If not stated otherwise, the code, resource files etc. is provided under the MIT license (see license file).

 [0]: https://github.com/mmig/mmir-v4-starter-kit
 [1]: http://cordova.apache.org/
 [4]: https://github.com/mmig/mmir-lib/tree/v4.2.1
 [5]: https://github.com/mmig/mmir-tooling/tree/v4.0.0
 [6]: https://github.com/mmig/mmir-plugin-scionqueue
 [8]: https://github.com/mmig/mmir
 [9]: http://mmig.github.io/mmir-v4-starter-kit/www
[10]: http://mmig.github.io/mmir-v4-starter-kit/www/testSemanticInterpreter.html
[11]: https://github.com/mmig/mmir-v4-starter-kit/tree/new-grammar-editor/www/appTestSemantic
[12]: https://cordova.apache.org/docs/en/latest/guide/platforms/android/
[13]: https://github.com/mmig/mmir-plugin-speech-nuance
