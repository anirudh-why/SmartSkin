@echo off
echo Creating the missing _patch-base.js file
if not exist "node_modules\@rushstack\eslint-patch\lib" mkdir "node_modules\@rushstack\eslint-patch\lib"
echo // This is a workaround for the error "Cannot find module './_patch-base'" > "node_modules\@rushstack\eslint-patch\lib\_patch-base.js"
echo module.exports = {}; >> "node_modules\@rushstack\eslint-patch\lib\_patch-base.js"
echo File created successfully
echo Now you can run: set DISABLE_ESLINT_PLUGIN=true && npm start 