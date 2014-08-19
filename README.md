MMIR Starter Kit
===========

### MMIR - Multimodal Mobile Interaction and Rendering framework

----

#### Introduction

This StarterKit is a small example application for the MMIR framework that can run locally in an (HTML5 capable) internet browser, and using the [Cordova framework][0], it can also be run as an Android app.


This is an ALPHA version for the MMIR framework (CAUTION: significant parts of the framework -- such as the API,
used technology etc. -- may still be subject to change)

As a goal, this frameworks aims to provide a lightweight multimodal dialog manager that -- for instance -- can run
on mobile devices. The base technology is HTML5 (JavaScript).

A core concept for the framework is the MVC (Model View Controller) pattern. The framework provides a template
mechanism similar to JSP (Java Server Pages), ASP (Active Server Pages), and alike.

The state of the dialog system can be tracked and manipulated based on a finite-state machine (FSM).
The framework uses SCXML (State Chart XML) via [SCION][1]: SCION is a JavaScript-based interpreter for SCXML files.

The framework core and its extensions are implemented as AMD (Asynchronous Module Definition) using [RequireJS][3].


The StarterKit provides basic capabilities for recognizing speech input (ASR, using the Google Speech Recognition service), and speech output (TTS, using [MARY][2]).

NOTE 1: There are some restrictions for ASR when running the StarterKit in a browser environment:
 * microphone access: currently only Google Chrome (version 21.x.x), and Firefox (version 20.x) allow access to the microphone resource for speech input
 * silence detection: currently only Google Chrome (version 25.x.x) and Firefox (version 26.x) provide an implementation for the AudioContext object, which is needed by our implementation for the end-of-speech detection (aka silence detection) 

NOTE 2: Since the Google Speech Recognition service now requires registration and an API key (and has a volume limit), the
        use of the general (i.e. _HTML5 based_) ASR solution of the framework is rather limited.
        However, for the browser environment Google Chrome, we recommend the _webkitAudioInput_ plugin that makes use of the
        [Web Speech API][7] (which, unfortunately, currently only Chrome supports).

----

#### Details

This is an example application that uses the [MMIR framework][4] (included 
as GIT subtree reference in ```/www/mmirf```).

Basic integration into the Cordova 3 build process is done by including the [MMIR tools][5]
(as GIT subtree reference in ```/build```; note: running the default ```ant``` task in within the build/tool directory will
copy the build-resources into the projects root directory).

Activated platforms

##### Prerequisites

Installed Cordova 3.x environment.


###### Custom Cordova Plugins

If you plan to use the MMIR framework in combination with SCION within an environment that __does not__
support HTML5 ```WebWorkers```, you need the [Queue Plugin][6] that allows to extend SCION with an
event queue.

NOTE: The Queue Plugin is already installed for the StarterKit example.

##### Build

After checking out the the project, you need to run ```cordova build``` within the project directory. 


##### Platform: Android

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

----

#### License
If not stated otherwise, the code, resource files etc. is provided under the MIT license (see license file).

[0]: http://cordova.apache.org/
[1]: https://github.com/jbeard4/SCION
[2]: http://mary.dfki.de/
[3]: http://requirejs.org/
[4]: https://github.com/mmig/mmir-lib
[5]: https://github.com/mmig/mmir-tooling
[6]: https://github.com/mmig/mmir-plugin-scionqueue
[7]: https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html
