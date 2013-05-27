/// <reference path="../d/node/node.d.ts" />
/// <reference path="../d/express/express.d.ts" />

import express = module('express');
import crypto = module('crypto');
import db = module('../db');
import l = module("../Language");


export function index(req:ExpressServerRequest, res:ExpressServerResponse): void
{
    db.getPost(null, function (posts: db.Post[]) {

        if (posts == null)
            posts = [];
        res.render('index', {
            title: 'req',
            user: req.session.user,
            posts:posts
        }); //index模版  ，title参数

    })

};

export function reg(req:any , res:any): void
{
    res.render("reg", {
        title: l.register,
        user: req.session.user
    });
} 

export function doReq(req: ExpressServerRequest, res: ExpressServerResponse, next: Function) {
   
    if (req.body["password-repeat"] != req.body["password"]) {
        //req.flash('error', '两次输入的口令不一致');
        req.session["flash"].error = l.password_incorect;
        res.redirect("/reg")
        return;
    }

    db.getUser(req.body["username"], function (user: db.User) {
        console.log(user, user != null);
        if (user != null) {
            req.session["flash"].error = l.userAlreadyExists;
            return res.redirect('/reg')
        }
       ////////////////////////////////////////////////
        var md5: crypto.Hash = crypto.createHash("md5");
        md5.update(req.body.password);
        var userObject = { name: req.body.username, password: md5.digest("base64") }
        db.addUser(userObject, function (user: db.User) {
            if (user != null) {
                req.session.user = userObject;
                req.session["flash"].success = l.reqSuccess;
                return res.redirect("/");
            } else {
                req.session["flash"].error = l.reqFailed;
                return res.redirect('/reg')
            }

        })
        ////////////////////////////////////////////////
    })




}

export function login(req: ExpressServerRequest, res: ExpressServerResponse): void
{
    res.render("login", { title: l.login, user: req.session.user, });
}
export function doLogin(req: ExpressServerRequest, res: ExpressServerResponse): void
{
    var md5: crypto.Hash = crypto.createHash("md5");
    md5.update(req.body.password);
    var password: string = md5.digest("base64");

    db.getUser(req.body.username, function (user) {
        if (!user)
        {
            req.session["flash"].error = l.userNotExists;
            return res.redirect("/login");
        }
        
        if (user.password != password)
        {
            req.session["flash"].error = l.password_incorect;
            return res.redirect("/login");
        }

        req.session.user = user;
        req.session.success = l.loginSuccess;
        res.redirect("/");
    })

}

export function logout(req: ExpressServerRequest, res: ExpressServerResponse): void
{
    req.session.user = null;
    req.session["flash"].success = l.logoutSuccess;
    res.redirect("/")
}

/**
    用户主页
*/
export function user(req: ExpressServerRequest, res: ExpressServerResponse): void
{
    db.getUser(req.params.user, function (u: db.User) {

        if (u == null)
        {
            req.session["flash"].error = l.userNotExists;
            res.redirect("/");
        } else
        {
            db.getPost(u.name, function (posts: db.Post[]) {
                res.render("user", { title: u.name, posts: posts ,user:req.session.user});
            })
        }
    })
}


export function post(req: ExpressServerRequest, res: ExpressServerResponse): void
{
    var currentUser: db.User = req.session.user;

    var newPost: db.Post = { user: currentUser.name, post: req.body.post, time: new Date() };
    db.addPost(newPost, function (p: db.Post) {
        if (p != null)
        {
            req.session["flash"].success = l.postSuccess;
            res.redirect("/u/" + currentUser.name);
         }
    })
}

export function hello(req: ExpressServerRequest, res: ExpressServerResponse): void
{
    res.send('The time is ' + new Date().toString());
}