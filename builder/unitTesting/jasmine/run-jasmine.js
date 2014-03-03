var system = require('system');

/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 30000, //< Default Max Timeout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 100ms
}


if (system.args.length !== 2) {
    console.log('Usage: run-jasmine.js URL');
    phantom.exit(1);
}

var page = require('webpage').create();
var fs = require('fs');

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

console.log(system.args[1]);


page.open(system.args[1], function(status){
    if (status !== "success") {
        console.log("Unable to access network");
        phantom.exit();
    } else {
        var myFs = fs;
        waitFor(function(){
            return page.evaluate(function(){
                return document.body.querySelector('.alert > .passingAlert.bar') !== null || document.body.querySelector('.alert > .failingAlert.bar') !== null;
            });
        }, function(){
            fs.write("test.html", page.content, "w");

            var exitCode = page.evaluate(function() {
                try {
                console.log('');
                console.log(document.body.querySelector('.description').innerText);
                var list = document.body.querySelectorAll('.results > #details > .specDetail.failed');
                if (list && list.length > 0) {
                  console.log('');
                  console.log(list.length + ' test(s) FAILED:');
                  for (i = 0; i < list.length; ++i) {
                      var el = list[i],
                          desc = el.querySelector('.description'),
                          msg = el.querySelector('.resultMessage.fail');
                      console.log('');
                      console.log(desc.innerText);
                      console.log(msg.innerText);
                      console.log('');
                  }
                  return 1;
                } else {
                  //var alertText = ;
                  console.log(document.body.querySelector('.alert > .passingAlert.bar').innerText);
                  return 0;
                }
              }catch (ex) {
                console.log(ex);
                return 1;
              }
            });

            var testResults = page.evaluate(function() {
              var results = '<?xml version="1.0" encoding="UTF-8"?>';
              var failedDetails = document.body.querySelectorAll(".results > #details > .specDetail.failed");

              var passed = document.body.querySelectorAll(".symbolSummary > .passed").length;
              var failed = document.body.querySelectorAll(".symbolSummary > .failed").length;

              results += "<testsuite name='middleware-jasmine' tests='" + (passed + failed) + "' failures='" + failed + "'>";

              var list = document.body.querySelectorAll('div.specSummary');

              if (list && list.length > 0) {
                for (var i = 0; i < list.length; ++i) {
                  var el = list[i];
                  var description = el.querySelector(".description");

                  results += "<testcase name='" + description.title + "'>";

                  if (el.className.indexOf("failed") >= 0) {
                    results += "<failure message='spec failure'>";

                    for (var j = 0; j < failedDetails.length; ++j) {
                      var href = failedDetails[j].querySelector(".description").href;

                      if (href == description.href) {
                        var messages = failedDetails[j].querySelectorAll(".messages div");
                        for (var k = 0; k < messages.length; k++) {
                          results += messages[k].innerText;
                          results += "&#xD;&#xA;";
                        }
                      }
                    }

                    results += "</failure>";
                  }

                  results += "</testcase>";
                }
              }

              results += "</testsuite>";

              return results;
            });
            fs.write("test.unit", testResults, "w");
            phantom.exit(exitCode);
        });
    }
});
