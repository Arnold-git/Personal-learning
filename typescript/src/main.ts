// type aliases

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