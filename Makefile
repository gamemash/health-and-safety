default:
	browserify src/js/main.js -o public/js/bundle.js

develop:
	budo src/js/main.js:public/js/bundle.js --serve js/bundle.js --live --open --dir ./public -v