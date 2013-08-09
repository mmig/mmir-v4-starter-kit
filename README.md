MMIR Starter Kit
===========

MMIR - Multimodal Mobile Interaction and Rendering framework

----

This StarterKit is a small example application for the MMIR framework that can run locally in an (HTML5 capable) internet browser, and using the Cordova framework (http://cordova.apache.org/), it can also be run as an Android app.


This is an ALPHA version for the MMIR framework (CAUTION: significant parts of the framework -- such as the API, used technology etc. -- may still be subject to change)

As a goal, this frameworks aims to provide a lightweight multi-modal dialog manager that -- for instance -- can run on mobile devices. The base technology is HTML5 (JavaScript).

A base principle is the MVC (Model View Controller) pattern. The framework provides a template mechanism similar to JSP (Java Server Pages), ASP (Active Server Pages), and alike.

The state of the dialog system can be tracked and manipulated based on a finite-state machine (FSM). This is realized using SCXML (State Chart XML) with SCION (https://github.com/jbeard4/SCION), a JavaScript based interpreter for SCXML files.

The StarterKit provides basic capabilities for recognizing speech input (ASR, using the Google Speech Recognition service), and speech output (TTS, using MARY http://mary.dfki.de/). Note, that for running the StarterKit in a browser environment currently only Google Chrome (version 25.x.x) allows access to the microphone resource for speech input.

----

If not stated otherwise, the code, resource files etc. is provided under the MIT license (see the license file).
