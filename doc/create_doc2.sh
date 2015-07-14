#!/usr/bin/env bash

# Linux version (should work, not tested):
_BASEPATH=$PWD
TARGETDIR=$_BASEPATH/../www/mmirf
EXCLUDEDIRS="-E=3rdParty|input_manager_state_chart|DialogDescription.js|grammar.js|gen|.json"
OUTPUTDIR=$_BASEPATH/api_doc
JSDOCDIR=./node_modules/jsdoc-toolkit
TEMPLATEDIR=$JSDOCDIR/templates
TEMPLATE=$TEMPLATEDIR/jsdoc
node $JSDOCDIR/app/noderun.js -A -t=$TEMPLATE -p -v -r $EXCLUDEDIRS -d=$OUTPUTDIR -v $TARGETDIR