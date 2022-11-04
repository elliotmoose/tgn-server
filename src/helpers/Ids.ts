import mongoose from "mongoose";

const Ids = {
    isValidId(value) {
        return mongoose.Types.ObjectId.isValid(value);
    },    
    makeId() {
        let id = mongoose.Types.ObjectId();
        return `${id}`;  
    },
    equal(a: string, b: string) : Boolean {
        return mongoose.Types.ObjectId.isValid(a) && mongoose.Types.ObjectId(a).equals(b);
    }
}

// export interface Id extends mongoose.Types.ObjectId {}
export interface Id extends String {}
export interface Ids {
    isValidId(value: string) : Boolean
    makeId() : string
    equal(a: string, b: string) : Boolean
}

export default Ids;

