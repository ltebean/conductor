##What is Conductor for

If you are developing a website, generally you will need some analytical tools to help you to track user behavior. There are lots of such kind of tools, and among them, Google Analytics maybe the most popular one, since it is very powerful, and, it's free!

Let's see a simple example that illustrates how to use GA to record a link click:
	
	<a href="#" onClick="_gaq.push(['_trackEvent', 'Videos', 'Play', 'Baby\'s First Birthday']);">Play</a>


You might find it's simple at the very beginning, however, as you want to track more things on your page, you have to add lots of tracker code in the html, finally you bind lots of non-business code in the page, they are prone to change, thus make your website become hard to maitain.

This is why we build Conductor, with the help of it, you can add and manage tracker code in the admin console without modifying the actual page. You could easily find how many things you are tracking now, and update them whenever you want. And, in the website page, you just need to include a script, that sounds cool, right?

##Installation 

It's painless to install Condutor on your own server, just four steps:

* clone this repo to your server
* start a mongodb with default config
* run 'npm install' to install the dependancies
* run 'node server.js --config='./config.json' to start the server

##Instruction

#####1. Config Account and Roles
When you start the server, you could specify a config file in the '--config' option, If you omit this option, a default config file 'config.json' will be used. You specify the account in this config file:

* the user with permission set to 's' has all access to the system including adding page config, setting the group, adding tracker code,etc.

* the user with permission set to 'r/w' only has the access to adding tracker code.

* the user with permission set to 'r' only has the access to viewing.


#####2. Config Database Connection
The database connection is also configured in the config file, you specify the host and port of the mongodb server.

#####3. Add Tracker Code
* log in with an account with permission "s".
* create a config group first, for example, "test".
* add a page to track, set the pageKey and the sample page to operate on.
* click 'view' to add tracker code.
* after the page is loaded, click the button on the top right corner, then you could choose the element in the page.
* select the element you are interested in, click it, a panel will appear and let you to specify which event on the element should cause the track. 

#####4. Give Your Website the Magic Power
Finally make the page aware of your configuration, just include conductor client js:
	
	<script type="text/javascript" id="conductor" data-pagekey="my-great-page" data-domian="the admin server domain" src="http://the admin sever domain/public/conductor.js"></script>






