# First Gulp Build System
`not meant for production`

###Installing packages and dependencies

After cloning the repo to your computer run the following command in your terminal: 
```
npm install && bower install
```
then run `gulp` which will watch css/js files in the src folder and automatically output concatenated and minified files to the dist folder in their appropriate folders.
`gulp` command also runs a `browser-sync` server in the dist folder. 
