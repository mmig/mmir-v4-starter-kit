@ECHO OFF

:start
echo Starting to generate API-documentation
echo.
echo Usage: %0 [X2 ^| X3]
echo parameters are optional (DEFAULT: X2)
echo     X2: (optional) use JSDoc2 for creating the documentation
echo     X3: (optional) use JSDoc3 for creating the documentation
echo.
echo.
echo.

REM SET _BASEPATH=%~dp0
SET _BASEPATH=.\
SET TARGETDIR=%_BASEPATH%..\www\mmirf
SET EXCLUDEDIRS="-E=gen|libs|node_modules|_node_modules"

if -%1-==-- ( 
echo no parameter specified, using default option X2...
goto jsdoc2 
)
IF %1==X2 goto jsdoc2
IF %1==X3 goto jsdoc3

goto jsdoc2

:jsdoc2

REM settings:
SET OUTPUTDIR=%_BASEPATH%api_jsdoc2

SET JSDOCDIR=tools\jsdoc-toolkit
REM SET JSDOCDIRSLASH=%JSDOCDIR:\=/%
SET TEMPLATEDIR=%JSDOCDIR%\templates
REM SET TEMPLATE=OrgaChem-JsDoc2-Template-Bootstrap
SET TEMPLATE=default
REM SET TEMPLATE=JSDoc-Bootstrap
REM SET TEMPLATE=jsdoc


echo Running JSDOC-Toolkit 2.4
echo.
echo Settings:
echo          doc source directory: %TARGETDIR%
echo          doc target directory: %OUTPUTDIR%
echo          excluding:            %EXCLUDEDIRS%
echo          JSDoc execution path: %JSDOCDIR%
echo          template:             %TEMPLATEDIR%\%TEMPLATE%
echo.

echo clearing doc target directory ...
echo.
rmdir %OUTPUTDIR% /s /q

echo executing ...
echo.

java -jar %JSDOCDIR%\jsrun.jar %JSDOCDIR%\app\run.js -A -t=%TEMPLATEDIR%\%TEMPLATE% -p -v -r %EXCLUDEDIRS% -d=%OUTPUTDIR% -v %TARGETDIR%
goto exit

:jsdoc3

REM settings:
SET OUTPUTDIR=%_BASEPATH%api_jsdoc3
SET JSDOCDIR=tools\jsdoc-master-dev
SET JSDOCDIRSLASH=%JSDOCDIR:\=/%
SET TEMPLATEDIR=%JSDOCDIR%\templates
REM SET TEMPLATEDIR=templates
REM SET TEMPLATE=JSDoc-DataTables-master
SET TEMPLATE=docstrap\template
REM SET TEMPLATE=default

echo Running JSDOC3
echo.
echo Settings:
echo          doc source directory: %TARGETDIR%
echo          doc target directory: %OUTPUTDIR%
echo          excluding:            - IGNORED -
echo          JSDoc execution path: %JSDOCDIR%
echo          template:             %TEMPLATEDIR%\%TEMPLATE%
echo.

echo clearing doc target directory ...
echo.
rmdir %OUTPUTDIR% /s /q

echo executing ...
echo.

%JSDOCDIR%\jsdoc.cmd -t %TEMPLATEDIR%\%TEMPLATE% -d %OUTPUTDIR% -r -p -c %_BASEPATH%\conf-jsdoc3.json --verbose %TARGETDIR%
REM %JSDOCDIR%\jsdoc.cmd --debug -t %TEMPLATEDIR%\%TEMPLATE% -d %OUTPUTDIR% -r -p -c %_BASEPATH%\conf-jsdoc3.json --verbose %TARGETDIR%
goto exit

:exit
echo.
echo done.
