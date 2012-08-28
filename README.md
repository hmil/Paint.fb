Paint.fb
========

Paint.fb est une application facebook permettant aux utilisateurs de partager une 
ardoise graphique tout en discutant. Elle vous permettra d'économiser de longues
heures d'explication ou bien simplement de vous amuser.

L'application utilise les technologies de l'HTML 5 (canvas + javascript), node.js
et socket.io ainsi que plusieurs bibliothèques javascript (backbone, underscore, jQuery)


Roadmap
-------

* Find friends  **done**
* Manage discussions  **done**
* Drawing with standard graphic tools  **done**
* Auth mechanisms (http + socket)  **done**

* Fix bugs with authorisation
* Add Terms of use and Privacy policy
* Allow conferences (3+ people sharing the same bench)
* Add more advanced drawing settings/tools
* Save drawings + share on FB
* Translate application

...

How to use
----------

First, you will need to run a mongo server (it's easy to do, just ask google).

Then, create a devloppment app on facebook, and create 'server/debug.js' file with the following code

    module.exports = function(){  
        process.env.FACEBOOK_APP_ID='YOUR_APP_ID';  
        process.env.FACEBOOK_SECRET='YOUR_APP_SECRET';  
        process.env.FACEBOOK_SCOPE='friends_online_presence';  
        process.env.COOKIE_SECRET='something_weird';  
        process.env.MONGO_URI='mongodb://localhost/test';  
    }


For production, simply add these variables in your process environment. (You can also use process environment for devlopment in which case you will let "debug.js"'s function empty.)

You can then run your app with  
`node index.js`

Client app must be compiled before being sent to producion. Just switch to 'public' dir and run :  
`node r.js -o app.build.js`  
This will compile the app and save it in 'app' directory