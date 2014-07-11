#!/usr/bin/env bash

# Linux version (should work, not tested):
_BASEPATH=$PWD
TARGETDIR=$_BASEPATH/../assets/www/javascripts
EXCLUDEDIRS="-E=3rdParty|input_manager_state_chart|DialogDescription.js|grammar.js|gen|.json"
OUTPUTDIR=$_BASEPATH/api_doc
JSDOCDIR=./tools/jsdoc-toolkit
TEMPLATEDIR=$JSDOCDIR/templates
TEMPLATE=jsdoc
java -jar $JSDOCDIR/jsrun.jar $JSDOCDIR/app/run.js -A -t=$TEMPLATEDIR/$TEMPLATE -p -v -r $EXCLUDEDIRS -d=$OUTPUTDIR -v $TARGETDIR