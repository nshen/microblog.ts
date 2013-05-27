/// <reference path="d/mongodb/mongodb.d.ts" />
import mongodb = module("mongodb");
import  util = module('util');



var server = new mongodb.Server("localhost", 27017, {auto_reconnect:true});
var db: mongodb.Db = new mongodb.Db("cnriabook", server);
db.open(function (err: Error, db: mongodb.Db) {
    if (err) {
        console.error("db.open error", err.message);
        return;
    }
    console.log("db.users.ensureIndex(name)");
    //users表 name索引 ////////////////////////////////////////////
    db.collection("users", {safe:true},function (err: Error, collection: mongodb.Collection) {
        if (err)
        {
            console.error("db.connection error");
            return db.close();
        }
        collection.ensureIndex("name", { unique: true }, function (err: Error, name: string) {
            if (err)
            {
                console.error("collection.ensureIndex");
                db.close();
            }
         
        })
    })
    ////////////////////////////////
    db.collection("posts", { safe: true }, function (error: Error, collection: mongodb.Collection)
    {
        if(err)
            console.error("db.connection error")
        collection.ensureIndex("user", {}, function (err: Error, name: string) {
            if (err)
                console.error("connection.ensureIndex error");
        })
    })
    /////////////////////////////////
         
});





export interface User {
    name: string;
    password: string;
}

export function getUser(name: string, callback: (user: User) => void ): void
{
    try {
        //2.读取collection
        db.collection('users', function (err: Error, collection: mongodb.Collection) {
            if (err)
            {
                console.error("#2#",err.toString());
                callback(null);
            }
           
            //3.查询
            collection.findOne({ name: name }, function (err: Error, doc: any) {
                if (err)
                {
                    console.error("#3#",err.toString());
                   // db.close();
                    callback(null);
                }
                console.log(typeof doc)

                console.log(util.inspect(doc, false, 5));
               // db.close();
                callback(doc);
            });
        });



    }catch (e){
        console.error(e.toString());
        callback(null);
        //db.close();
    }
}

export function addUser(user:User, callback: (user: User) => void ): void
{
    try {

            // 2. collection
            db.collection("users", function (err: Error, collection: mongodb.Collection) {
                if (err) throw (err);
                //3. insert
                collection.insert(user, { safe: true }, function (err: Error, result: User) {
                    if (err) throw (err);
                  //  db.close()
                    callback(result);
                })

            })
     

    } catch(e) {

        console.error(e.toString());
       // db.close();
        callback(null);
    }
}



export interface Post
{
    user: string;
    post: string;
    time: Date;
}

export function addPost(p:Post , callback:(post:Post)=>void): void
{
    db.collection("posts", function (error: Error, collection:mongodb.Collection) {
        if (error)
            console.error("addPost error");
        collection.insert(p, { safe: true }, function (err:Error , result:any) {
            if (err)
                console.error("addPost collection insert error" , err.message);
            callback(result);
        })
    })
}

export function getPost(username: string, callback: (p: Post[]) => void ): void
{
    db.collection("posts", function (err: Error, collection: mongodb.Collection): void {

        if (err)
            console.error("getPost err")

        collection.find(username ? { user: username } : {}).sort({ time: -1 }).toArray(function (err: Error, arr: any[]) {
            if (err)
                console.error(err.message);
            var posts:Post[] = [];
            arr.forEach(function (value: any, index: number) {
                posts.push({ user: value.user, post: value.post, time: value.time });
            })
            callback(posts)
        })

    })
}