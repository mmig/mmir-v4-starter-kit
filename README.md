MMIR Starter Kit
===========

MMIR - Multimodal Mobile Interaction and Rendering framework

----

This StarterKit is a small example application for the MMIR framework that can run locally in an (HTML5 capable) internet browser, and using the [Cordova framework][0], it can also be run as an Android app.


This is an ALPHA version for the MMIR framework (CAUTION: significant parts of the framework -- such as the API, used technology etc. -- may still be subject to change)

As a goal, this frameworks aims to provide a lightweight multi-modal dialog manager that -- for instance -- can run on mobile devices. The base technology is HTML5 (JavaScript).

A base principle is the MVC (Model View Controller) pattern. The framework provides a template mechanism similar to JSP (Java Server Pages), ASP (Active Server Pages), and alike.

The state of the dialog system can be tracked and manipulated based on a finite-state machine (FSM). This is realized using SCXML (State Chart XML) with [SCION][1], a JavaScript based interpreter for SCXML files.

The StarterKit provides basic capabilities for recognizing speech input (ASR, using the Google Speech Recognition service), and speech output (TTS, using [MARY][2]).
Note however, that there are some restrictions for running the StarterKit in a browser environment:
 * microphone access: currently only Google Chrome (version 21.x.x), and Firefox (version 20.x) allow access to the microphone resource for speech input
 * silence detection: currently only Google Chrome (version 25.x.x) and Firefox (version 26.x) provide an implementation for the AudioContext object, which is needed by our implementation for the end-of-speech detection (aka silence detection) 

----

If not stated otherwise, the code, resource files etc. is provided under the MIT license (see license file).

[0]: http://cordova.apache.org/
[1]: https://github.com/jbeard4/SCION
[2]: http://mary.dfki.de/
