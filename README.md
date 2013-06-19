##What is Conductor for

If you are developing a website, generally you will need some analytical tools to help you to track user behavior. There are lots of such kind of tools, and among them, Google Analytics maybe the most popular one, since it is very powerful, and, it's free!

Let's see a simple example that illustrates how to use GA to record a link click:
	
	<a href="#" onClick="_gaq.push(['_trackEvent', 'Videos', 'Play', 'Baby\'s First Birthday']);">Play</a>


You might find it's simple at the very beginning, however, as you want to track more things on your page, you have to add lots of tracker code in the html, finally you bind lots of non-business code in the page, they are prone to change, thus make your website become hard to maitain.

This is why we build Conductor, with the help of it, you can add and manage tracker code in the admin console without modifying the actual page. You could easily find how many things you are tracking now, and update them whenever you want. And, in the website page, you just need to include a script, that sounds cool, right?

###Installation

It's painless to install Condutor on your own server, just four steps:

* clone this repo to your server
* start a mongodb with default config
* run 'npm install' to install the dependancies
* run 'node server.js' to start the server

