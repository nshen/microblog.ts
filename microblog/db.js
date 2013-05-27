var mongodb = require("mongodb")
var util = require('util')
var server = new mongodb.Server("localhost", 27017, {
    auto_reconnect: true
});
var db = new mongodb.Db("cnriabook", server);
db.open(function (err, db) {
    if(err) {
        console.error("db.open error", err.message);
        return;
    }
    console.log("db.users.ensureIndex(name)");
    db.collection("users", {
        safe: true
    }, function (err, collection) {
        if(err) {
            console.error("db.connection error");
            return db.close();
        }
        collection.ensureIndex("name", {
            unique: true
        }, function (err, name) {
            if(err) {
                console.error("collection.ensureIndex");
                db.close();
            }
        });
    });
    db.collection("posts", {
        safe: true
    }, function (error, collection) {
        if(err) {
            console.error("db.connection error");
        }
        collection.ensureIndex("user", {
        }, function (err, name) {
            if(err) {
                console.error("connection.ensureIndex error");
            }
        });
    });
});
function getUser(name, callback) {
    try  {
        db.collection('users', function (err, collection) {
            if(err) {
                console.error("#2#", err.toString());
                callback(null);
            }
            collection.findOne({
                name: name
            }, function (err, doc) {
                if(err) {
                    console.error("#3#", err.toString());
                    callback(null);
                }
                console.log(typeof doc);
                console.log(util.inspect(doc, false, 5));
                callback(doc);
            });
        });
    } catch (e) {
        console.error(e.toString());
        callback(null);
    }
}
exports.getUser = getUser;
function addUser(user, callback) {
    try  {
        db.collection("users", function (err, collection) {
            if(err) {
                throw (err);
            }
            collection.insert(user, {
                safe: true
            }, function (err, result) {
                if(err) {
                    throw (err);
                }
                callback(result);
            });
        });
    } catch (e) {
        console.error(e.toString());
        callback(null);
    }
}
exports.addUser = addUser;
function addPost(p, callback) {
    db.collection("posts", function (error, collection) {
        if(error) {
            console.error("addPost error");
        }
        collection.insert(p, {
            safe: true
        }, function (err, result) {
            if(err) {
                console.error("addPost collection insert error", err.message);
            }
            callback(result);
        });
    });
}
exports.addPost = addPost;
function getPost(username, callback) {
    db.collection("posts", function (err, collection) {
        if(err) {
            console.error("getPost err");
        }
        collection.find(username ? {
            user: username
        } : {
        }).sort({
            time: -1
        }).toArray(function (err, arr) {
            if(err) {
                console.error(err.message);
            }
            var posts = [];
            arr.forEach(function (value, index) {
                posts.push({
                    user: value.user,
                    post: value.post,
                    time: value.time
                });
            });
            callback(posts);
        });
    });
}
exports.getPost = getPost;
