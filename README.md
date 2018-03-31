# Website-Uptime-Monitor
Website availability and response time monitoring tool, built using MEAN stack

Packages
---------
    "angular-smart-table": "^2.1.0",
    "body-parser": "^1.13.2",
    "express": "^4.13.1",
    "mongoose": "^4.0.7",
    "node-libcurl": "^0.4.1",
    "nodemailer": "^1.4.0",
    "nodemailer-smtp-pool": "^1.1.1",
    "socket.io": "^1.3.6",
    "socket.mvc": "^0.2.0",
    "statuses": "^1.2.1"

Dependencies
-------------
dependency for node-libcurl

    sudo apt-get install libcurl4-gnutls-dev
and 

    node --version    ->    v0.12.5
    npm --version     ->    2.11.2
    
Installation Steps
-------------------

1. Clone the github repository in your system

        git clone https://github.com/yesyayen/Website-Uptime-Monitor.git

        cd Website-Uptime-Monitor

2. Install the dependencies. List of dependencies are provided inside package.json file.

        npm install

3. Edit the configuration file. - config.js

        Provide your gmail username and password. This is used to send alert mail’s when
        website goes down

4. Start the server

        node app.js

5. If you want to start the server as a background process, use

        nohup node app.js &

6. Open your browser and go to 127.0.0.1:8002(http://127.0.0.1:8002)

7. You can see the homepage

Third Party Libraries used
---------------------------
* [NodeJS](http://nodejs.org/), licensed under the [MIT License](https://github.com/joyent/node/blob/master/LICENSE#L5-22),
* [Socket.io](http://socket.io/), licensed under the [MIT License](https://github.com/LearnBoost/socket.io/blob/master/Readme.md),
* [MongooseJS](http://mongoosejs.com/), licensed under the [MIT License](https://github.com/LearnBoost/mongoose/blob/master/README.md),
* [TwitterBootstrap](http://twitter.github.com/bootstrap/), licensed under the [Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0),
* [node-curl](https://www.npmjs.com/package/node-curl)
* [Angular-smart-table](http://lorenzofox3.github.io/smart-table-website/)
* [amcharts](http://www.amcharts.com/)
