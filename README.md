MMIR Starter Kit
===========

### MMIR - Multimodal Mobile Interaction and Rendering framework

----

#### Introduction

This StarterKit is a small example application for the MMIR framework that can run locally in an (HTML5 capable) internet browser, and using the [Cordova framework][0], it can also be run as an Android app.


This is an ALPHA version for the MMIR framework (CAUTION: significant parts of the framework -- such as the API, used technology etc. -- may still be subject to change)

As a goal, this frameworks aims to provide a lightweight multi-modal dialog manager that -- for instance -- can run on mobile devices. The base technology is HTML5 (JavaScript).

A base principle is the MVC (Model View Controller) pattern. The framework provides a template mechanism similar to JSP (Java Server Pages), ASP (Active Server Pages), and alike.

The state of the dialog system can be tracked and manipulated based on a finite-state machine (FSM). This is realized using SCXML (State Chart XML) with [SCION][1], a JavaScript based interpreter for SCXML files.

The framework core and its extensions are implemented as AMD (Asynchronous Module Definition) using [requirejs][3].

The StarterKit provides basic capabilities for recognizing speech input (ASR, using the Google Speech Recognition service), and speech output (TTS, using [MARY][2]).
Note however, that there are some restrictions for running the StarterKit in a browser environment:
 * microphone access: currently only Google Chrome (version 21.x.x), and Firefox (version 20.x) allow access to the microphone resource for speech input
 * silence detection: currently only Google Chrome (version 25.x.x) and Firefox (version 26.x) provide an implementation for the AudioContext object, which is needed by our implementation for the end-of-speech detection (aka silence detection) 

#### Details

This is an example application that uses the [MMIR framework][4] (included in 
as GIT subtree references ```/www/mmirf```).

Basic integration into the Cordova 3 build process is done by including the [MMIR tools][5]
(as GIT subtree reference in ```/build```; note: running the default ```ant``` task in within the build/tool directory will
copy the build-resources into the projects root directory).


##### Platform: Android

For platform-specific development, the Android projects can be imported into Eclipse (see
Cordova's platform guides for Android for prerequisites etc.):

 * select ```import...``` and then ```Existing Android Code Into Workspace```
 * then select the sub-directory ```/platforms/android```

This will import 2 projects: the Cordova-library project and the project for the MMIR StarterKit.

The imported StarterKit project contains a reference to the ```/www```: if you want to make 
platform-independent changes, you should use this referenced "directory".
After changing files, you need to run ```cordova build``` in order to propagate the changes
from the ```/www``` directory to the ```platform/android/assets/www``` directory.

----

#### License
If not stated otherwise, the code, resource files etc. is provided under the MIT license (see license file).

[0]: http://cordova.apache.org/
[1]: https://github.com/jbeard4/SCION
[2]: http://mary.dfki.de/
[3]: http://requirejs.org/
[4]: https://github.com/mmig/mmir-lib
[5]: https://github.com/mmig/mmir-tooling
