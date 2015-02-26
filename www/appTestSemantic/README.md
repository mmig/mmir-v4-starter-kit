Test SemanticInterpeter
----

helpers, files etc. for `testSemanticInterpreter.html`

The page `testSemanticInterpreter.html` lets you test your language grammars in
`config/languages/<language code>/grammar.json`.
These grammars are used for "extracting the meaning" of texts, e.g. the results
from speech recognition.

For instance, if speech recognition returns the text __"Turn the light in the kitchen on"__,
a grammar could extract the "semantic meaning" by returning the JSON object
```javascript
{
  "semantic": {
    "location": "kitchen",
    "target": "light",
    "action": "on"
  }
}
```

**Compatibility Notes:** compatible with `mmir-lib` version 3.4.x - 3.5.x


Usage
----
Open `testSemanticInterpreter.html` in a browser (e.g. Chrome or FireFox).


Usage Notes
--

If you are using Chrome, `testSemanticInterpreter.html` may not work, if it is opened directly 
as a file (i.e. not served by a web server).

As a workaround, you can start Chrome with command line argument `--allow-file-access-from-files`. 
If an instance of Chrome is already running, you either need to close all open instances of Chrome first,
or, alternatively, you can use the additional command line `--user-data-dir=<path to a directory>` in order
to start a separate instance of Chrome (with its own user-data directory).


Used Libraries
---

 * Orion Editor
 * Esprima
 * jsonlint
 * lodash
 * w2ui
 * font-awesome
