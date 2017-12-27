var Monitor   = require('../models/websites');
var Ping = require('../models/pings');
var Curl      = require('node-libcurl').Curl;
var socketMVC = require('socket.mvc');
var getStatusMsg    = require('statuses');
var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');
var config = require('../../config');

 
/*Login logic*/

module.exports.create = function(req, res) {
    var monitor = new Monitor(req.body);
    monitor.save(function(err, result) {
        res.json(result);

        if (err) {
            if (err.name == 'ValidationError') {
                for (field in err.errors) {
                    console.log(err.errors[field].message)
                }
            } else {
                console.log(err.errors[field].message)
            }
        }
        else
        {
            startWebsiteWatchTimer(result.url, result.pollInterval, result.name);
            console.log(result.name);
            console.log(result.url);
            console.log(result.pollInterval);
        }
    });
}

var timers = [];

function startWebsiteWatchTimer(url, seconds, name)
{
    timers[name] = setInterval(function(){
        console.log(name + "  " + url);
        checkStatus(url, name);
    }, seconds * 1000);    
}
var webName;
var webURL;
function checkStatus(url, name)
{
    webName = name;
    webURL = url;
    var curl = new Curl();
    curl.setOpt('URL', url);
    curl.setOpt( Curl.option.TIMEOUT, 30 );
    curl.setOpt('FOLLOWLOCATION', true);

    curl.on('end', function(statusCode, body, headers) {

        console.info( 'URL', url);
        console.info( 'Status Code: ', statusCode );
        pushStatusToClients(name, url, statusCode, this.getInfo('TOTAL_TIME'));

        this.close();
    });
    //curl.on( 'error', curl.close.bind( curl ) );
    curl.on('error', cb);
    curl.perform();
}

function cb(statusOrError) 
{
    var siteName = this.getInfo(Curl.info.PRIVATE);
    if(siteName == undefined)
    {

    }

    this.close();

    if (typeof statusOrError !== "number") { //we have an error
        console.error(siteName, ' - Error: ', statusOrError);
        pushStatusToClients(webName, webURL, "404", "0.0");
    } else {
        console.info(siteName, ': ', statusOrError);
    }
    return;
}

function pushStatusToClients(name, url, statusCode, responseTime)
{
    var isUp = "false";
    if(parseInt(statusCode) == 200)
    {
        isUp = "true";
    }
    else if(parseInt(statusCode) == 404)
    {
        isUp = "false";
    }
    socketMVC.everyone('websiteStatus', {'name' : name, 'statusCode' : statusCode, 'isUp' : isUp, 'responseTime': responseTime});
   
    updateWebsitesMongoDB(name, url, statusCode, responseTime, isUp);
}

function updateWebsitesMongoDB(name, url, statusCode, responseTime, isUp)
{
    /*
    Spent a lot of time in this function. Monitor.findOne is an async fuction. Without knowing that i tried to compare isUpDB(outcome of the
    call back function). The  solution is to write the comparison and the following update inside the call back function of first one, so that
    this will finish invoke them 

    */
    var isUpDB;
    var email;
    var mobileNum;
    var mobileProvider;

    Monitor.findOne({'name': name}, function(err, results) {
        console.log(results);
        isUpDB = results.isUp;
       
       

       if(isUpDB === isUp)
       {
            addWebsitePingMongoDB(results._id, name, statusCode, responseTime, isUp, "false");
            return;
       }

       addWebsitePingMongoDB(results._id, name, statusCode, responseTime, isUp, "true");

       if(results.isAlert)
       {
            email = results.mailID;
            mobileNum = results.mobileNumber;
            mobileProvider = results.mobileProvider;
       }

        Monitor.findOneAndUpdate({ 'name': name}, {$set: { 'statusCode': statusCode, 'responseTime': responseTime, 'isUp': isUp }}, function(err, user) {
            if (err) throw err;
            console.log("updating " + user._id);
        });

        //sendAlertMail(isUp, url, email, mobileNum, mobileProvider);

    });
}

function addWebsitePingMongoDB(websiteID, name, statusCode, responseTime, isUp, isStatusChange)
{
    var ping = new Ping();
    ping.name = name;
    ping.websiteID = websiteID;
    ping.isUp = isUp;
    ping.statusCode = statusCode;
    ping.responseTime = responseTime;
    ping.isStatusChange = isStatusChange;

    ping.save(function(result) {
        console.log("saved - PING");
    });
}

var removeFromTimer = function(name)
{
    clearInterval(timers[name]);
    console.log(name + ' - interval cleared');   
}

exports.removeFromTimer = removeFromTimer;

function sendAlertMail(isUp, url, email, mobileNum, mobileProvider)
{
    var sub;
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.gmail.user_name,
            pass: config.gmail.password
        }
    });
    
    if(isUp === 'true')
    {
        sub = url + " is Up and Running";
    }
    else
    {
        sub = url + " is Down";
    }

    // setup e-mail data with unicode symbols
    var mailOptions = {
       from: 'Webmonitor Service <emailemail@gmail.com>',
        to: email,
        subject: sub,
        text: sub + "\n Kindly check your website"
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    });

    if(mobileProvider === 'att')
    {
        mobileNum = mobileNum + "@txt.att.net";
    }
        // setup e-mail data with unicode symbols
    var smsOptions = {
       from: 'Webmonitor Service <emailemail@gmail.com>',
        to: mobileNum,
        subject: sub,
        text: sub + "\n Kindly check your website"
    };

    // send mail with defined transport object
    transporter.sendMail(smsOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('SMS sent: ' + info.response);

    });
}

/*
setTimeout(function(){
clearInterval(timers["sophie"]);
clearInterval(timers[1]);
console.log('interval cleared');
},6000);
*/
