#!/bin/bash

mvn -q -f /Users/user-name/dev/commons-scxml-js/pom.xml exec:java -DscxmlInputArgs="--backend state --beautify --ie inputDescriptionSCXML.xml" > InputDescription.js 