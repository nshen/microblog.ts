/// <reference path="./d/node/node.d.ts" />
/// <reference path="./d/express/express.d.ts" />

import express = module('express');
import routes = module("./routes/index");
import http = module('http');
import path = module('path');
import fs = module("fs");
import l = module("./Language");
//l.setChinese();

var app: Express = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon());
////////////////////////////////////////////
app.set('env', 'production'); //设置环境
var accessLogfile: fs.WriteStream;
var errorLogFile: fs.WriteStream;
if ('development' == app.get('env'))
{
    console.log("development env");
    app.use(express.errorHandler());
    app.use(express.logger('dev'));
} else {
    console.log("production env");
    accessLogfile = fs.createWriteStream("access.log", { flags: "a" });
    errorLogFile = fs.createWriteStream("error.log", { flags: "a" });
    app.use(express.logger({ stream: accessLogfile }));


}
////////////////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: "cnriabook"}))
app.use(function (req, res, next) {
    if (accessLogfile) {
        app.use(express.logger({ stream: accessLogfile }));
    }
    if (req.session.flash) {
        if (req.session.flash.success)
            res.locals.success = req.session.flash.success;
        if (req.session.flash.error)
            res.locals.error = req.session.flash.error;
        delete req.session.flash.success;
        delete req.session.flash.error;
    } else {
        req.session.flash = {};
    }
    next();
});

app.use(app.router);

//////////////////////////
// 错误处理
//////////////////////////
app.use(function (err, req, res:ExpressServerResponse, next) {
    console.log("fuck")
    if (errorLogFile) {
        errorLogFile.write("[" + new Date() + "]" + req.url + "\n" + err.stack + "\n");
    }
    res.send(500,  'Something blew up!');
});

/////////////////////////////////////

function checkNotLogin(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void
{
    
    if (req.session.user) {
        req.session["flash"].error = l.userAlreadyLogin;
        return res.redirect("/");
    }
    next();
}

function checkLogin(req: ExpressServerRequest, res: ExpressServerResponse, next: Function): void 
{
    if (!req.session.user) {
        req.session["flash"].error = l.userNotLogin;
        return res.redirect("/login");
    }
    next();
}

app.get("/", routes.index); //首页

app.get("/reg", checkNotLogin);//已经登录跳回首页
app.get("/reg", routes.reg);//注册
app.post("/reg",checkNotLogin)
app.post("/reg", routes.doReq);

app.get("/login", checkNotLogin);
app.get("/login", routes.login);//登录
app.post("/login", checkNotLogin);
app.post("/login", routes.doLogin);

app.get("/logout", checkLogin);
app.get("/logout", routes.logout);//登出

app.get("/u/:user", routes.user);//用户主页

app.post("/post", checkLogin);
app.post("/post", routes.post);//发表书评


////////////////////////////////////////////

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

