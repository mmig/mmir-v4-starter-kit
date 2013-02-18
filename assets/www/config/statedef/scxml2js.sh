#!/bin/bash

mvn -q -f /Users/user-name/dev/commons-scxml-js/pom.xml exec:java -DscxmlInputArgs="--backend state --beautify --ie input_manager_scxml.xml" > input_manager_state_chart.js 