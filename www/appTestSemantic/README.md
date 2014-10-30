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


Usage
----
Open `testSemanticInterpreter.html` in a browser (e.g. Chrome or FireFox).


Notes
--

If you are using Chrome, `testSemanticInterpreter.html` may not work if it is opened directly 
as a file (i.e. not servered by a web server).

As a workaround, you can start Chrome with command line argument `--allow-file-access-from-files` 
(you may need to close all other instances of Chrome first).
