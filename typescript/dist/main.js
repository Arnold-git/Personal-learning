var someElement = document.querySelector(".foo");
// type assertion
var pageNumber = "1";
var numericPageNumber = pageNumber;
// any/void/never/unknown data type
var doSomething = function () {
    console.log("do something");
};
// const doSomething = (): never => {
//     throw "never"
// };
var vAry = 10;
var vUnknown = 10;
var s1 = vAry;
var s2 = vUnknown; // we cant directly assign type unknown to other type
var popularTags = ['dragon', 'coffee'];
var dragonTags = "dragon";
var user = null;
var username = "alex";
var pageNum = "1";
var errorMessage = null;
// Functions
var getFullName = function (name, surname) {
    return name + " " + surname;
};
console.log(getFullName("fy", "lesson"));
// variables
var hello = "world";
hello = "foo";
// let hello:string = "world"
// hello = "boy"
// let hello: string = "world"
// hello = true
