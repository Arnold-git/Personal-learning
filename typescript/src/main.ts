// type assertion
let pageNumber: string = "1";
let numericPageNumber: number = (pageNumber as unknown) as number





// any/void/never/unknown data type

const doSomething = (): void => {
    console.log("do something")
};

// const doSomething = (): never => {
//     throw "never"
// };

let vAry: any = 10;
let vUnknown: unknown = 10;

let s1: string = vAry;

let s2: string = vUnknown as string // we cant directly assign type unknown to other type


// any D-type
// let foo: any = "foo"
// console.log(foo.bar());


// type aliases and union

type ID = string
type PopularTag = string;
type MaybePopularTags = PopularTag | null


const popularTags: PopularTag[] = ['dragon', 'coffee']
const dragonTags: MaybePopularTags = "dragon"
// union operator in typescript
interface UserInterface {
    name: string;
    surname: string;
}


let user: UserInterface | null = null;


let username: string = "alex"

let pageNum: string | number = "1";

let errorMessage: string | null = null;


// Functions

const getFullName = (name:string, surname:string): string => {
    return name + " " + surname;
};

console.log(getFullName("fy", "lesson"))

// variables
let hello:string = "world";
hello = "foo"

// let hello:string = "world"
// hello = "boy"

// let hello: string = "world"
// hello = true