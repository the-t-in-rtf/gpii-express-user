/*

  Mount all the feature-specific endpoints under a single umbrella class.  Returns the API documentation by default.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("gpii-express");
require("./current.js");
require("./docs.js");
require("./forgot.js");
require("./login.js");
require("./logout.js");
require("./reset.js");
require("./signup.js");
require("./verify.js");

fluid.registerNamespace("gpii.express.user.api");

gpii.express.user.api.handleRoute = function (that, request, response, next) {
    that.options.router(request, response, next);
};

fluid.defaults("gpii.express.user.api", {
    gradeNames: ["gpii.express.router"],
    path:       "/user",
    method:     "use",
    templateDirs: "%gpii-express-user/src/templates",
    couch: {
        userDbName: "_users",
        userDbUrl: {
            expander: {
                funcName: "fluid.stringTemplate",
                args:     ["http://admin:admin@localhost:%port/%userDbName", "{that}.options.couch"]
            }
        }
    },
    distributeOptions: [
        {
            "source": "{that}.options.couch",
            "target": "{that gpii.express.router}.options.couch"
        },
        {
            source: "{that}.options.app",
            target: "{that gpii.express.router}.options.app"
        }
    ],
    components: {
        // Required middleware
        json: {
            type: "gpii.express.middleware.bodyparser.json"
        },
        urlencoded: {
            type: "gpii.express.middleware.bodyparser.urlencoded"
        },
        cookieparser: {
            type: "gpii.express.middleware.cookieparser"
        },
        docs: {
            type: "gpii.express.api.docs.router"
        },
        session: {
            type: "gpii.express.middleware.session",
            options: {
                config: {
                    express: {
                        session: {
                            secret: "Printer, printer take a hint-ter."
                        }
                    }
                }
            }
        },

        // API Endpoints (routers)
        current: {
            type: "gpii.express.user.api.current"
        },
        forgot: {
            type: "gpii.express.user.api.forgot"
        },
        login: {
            type: "gpii.express.user.api.login"
        },
        logout: {
            type: "gpii.express.user.api.logout"
        },
        reset: {
            type: "gpii.express.user.api.reset"
        },
        signup: {
            type: "gpii.express.user.api.signup"
        },
        verify: {
            type: "gpii.express.user.api.verify"
        }
    },
    // We are a router that only has child components, so we wire the route invoker directly into our router.
    invokers: {
        route: {
            funcName: "gpii.express.user.api.handleRoute",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});

// An instance of `gpii.express.user.api` that already has the required session middleware wired in
//
// Generally you will want to start with the base grade and provide your own.
fluid.defaults("gpii.express.user.api.hasMiddleware", {
    gradeNames: ["gpii.express.user.api"],
    components: {
        session: {
            type: "gpii.express.middleware.session",
            options: {
                config: {
                    express: {
                        session: {
                            secret: "Printer, printer take a hint-ter."
                        }
                    }
                }
            }
        }
    }
});
