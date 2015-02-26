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

Some more details about grammars in MMIR can be found in the [Wiki][g1], e.g. some 
[general information][g2] and [how to add a new grammar][g3] (still under constructions!).


**Compatibility Notes:** compatible with [mmir-lib][1] version 3.4.x - 3.5.x


Usage
----
Open `testSemanticInterpreter.html` in a browser (e.g. Chrome or FireFox).


Usage Notes
----

##### Chrome

if the HTML file is opened directly as file, you need to use command line argument
`--allow-file-access-from-files` (see [online-info][2] for more details).

If an instance of Chrome is already running, you need to close it first.

Or you can use the additional argument `--user-data-dir=<path to folder for new profile>`
,where `<path to folder for new profile>` is the path to a new directory or a directory with
another Chrome user profile:
using this argument will open a separate instance of Chrome with its own user profile
(see [Chrome doc][3] for more details).


Used Libraries
---

 * Orion Editor
 * Esprima
 * jsonlint
 * lodash
 * w2ui
 * font-awesome


[g1]: https://github.com/mmig/mmir/wiki/
[g2]: https://github.com/mmig/mmir/wiki/3.3-Application-Language-Configuration
[g3]: https://github.com/mmig/mmir/wiki/3.9-Setup-MMIR-for-Internationalization#add-a-new-grammar 
[1]: https://github.com/mmig/mmir-lib
[2]: http://www.chrome-allow-file-access-from-file.com/
[3]: http://www.chromium.org/user-experience/user-data-directory#TOC-Running-from-a-Custom-Location