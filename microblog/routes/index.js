
var crypto = require('crypto')
var db = require('../db')
var l = require("../Language")
function index(req, res) {
    db.getPost(null, function (posts) {
        if(posts == null) {
            posts = [];
        }
        res.render('index', {
            title: 'req',
            user: req.session.user,
            posts: posts
        });
    });
}
exports.index = index;
;
function reg(req, res) {
    res.render("reg", {
        title: l.register,
        user: req.session.user
    });
}
exports.reg = reg;
function doReq(req, res, next) {
    if(req.body["password-repeat"] != req.body["password"]) {
        req.session["flash"].error = l.password_incorect;
        res.redirect("/reg");
        return;
    }
    db.getUser(req.body["username"], function (user) {
        console.log(user, user != null);
        if(user != null) {
            req.session["flash"].error = l.userAlreadyExists;
            return res.redirect('/reg');
        }
        var md5 = crypto.createHash("md5");
        md5.update(req.body.password);
        var userObject = {
            name: req.body.username,
            password: md5.digest("base64")
        };
        db.addUser(userObject, function (user) {
            if(user != null) {
                req.session.user = userObject;
                req.session["flash"].success = l.reqSuccess;
                return res.redirect("/");
            } else {
                req.session["flash"].error = l.reqFailed;
                return res.redirect('/reg');
            }
        });
    });
}
exports.doReq = doReq;
function login(req, res) {
    res.render("login", {
        title: l.login,
        user: req.session.user
    });
}
exports.login = login;
function doLogin(req, res) {
    var md5 = crypto.createHash("md5");
    md5.update(req.body.password);
    var password = md5.digest("base64");
    db.getUser(req.body.username, function (user) {
        if(!user) {
            req.session["flash"].error = l.userNotExists;
            return res.redirect("/login");
        }
        if(user.password != password) {
            req.session["flash"].error = l.password_incorect;
            return res.redirect("/login");
        }
        req.session.user = user;
        req.session.success = l.loginSuccess;
        res.redirect("/");
    });
}
exports.doLogin = doLogin;
function logout(req, res) {
    req.session.user = null;
    req.session["flash"].success = l.logoutSuccess;
    res.redirect("/");
}
exports.logout = logout;
function user(req, res) {
    db.getUser(req.params.user, function (u) {
        if(u == null) {
            req.session["flash"].error = l.userNotExists;
            res.redirect("/");
        } else {
            db.getPost(u.name, function (posts) {
                res.render("user", {
                    title: u.name,
                    posts: posts,
                    user: req.session.user
                });
            });
        }
    });
}
exports.user = user;
function post(req, res) {
    var currentUser = req.session.user;
    var newPost = {
        user: currentUser.name,
        post: req.body.post,
        time: new Date()
    };
    db.addPost(newPost, function (p) {
        if(p != null) {
            req.session["flash"].success = l.postSuccess;
            res.redirect("/u/" + currentUser.name);
        }
    });
}
exports.post = post;
function hello(req, res) {
    res.send('The time is ' + new Date().toString());
}
exports.hello = hello;
