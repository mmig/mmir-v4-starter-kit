MMIR Starter Kit
===========

MMIR - Mobile Multimodal Interaction and Rendering framework

----

This is an ALPHA version for the MMIR framework (CAUTION: significant parts of the framework -- such as the API, used technology etc. -- may still be subject to change)

As a goal, this frameworks aims to provide a lightweight multi-modal dialog manager that -- for instance -- can run on mobile devices. The base technology is HTML5 (JavaScript).

A base principle is the MVC (Model View Controller) pattern. The framework provides a template mechanism similar to JSP (Java Server Pages), ASP (Active Server Pages), and alike.

The state of the dialog system can tracked via a finite-state machine (FSM) based on SCXML (State Chart XML).

The StarterKit provides basic capabilities for recognizing speech input (ASR, using the Google Speech Recognition service), and speech output (TTS, using MARY http://mary.dfki.de/). Note, that for running the StarterKit in a browser environment currently only Google Chrome (version 25.x.x) allows access to the microphone resource for speech input.


This StarterKit represents a small example application that can run locally in an (HTML5 capable) internet browser, and using the Cordova framework, it can be executed as an Android app.

----

If not stated otherwise, the code, resource files etc. is provided under the MIT license (see the license file).

