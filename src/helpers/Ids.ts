import mongoose from "mongoose";

const Ids = {
    isValidId(value) {
        return mongoose.Types.ObjectId.isValid(value);
    },    
    makeId() {
        return mongoose.Types.ObjectId();  
    },
    equal(a: string, b: string | Id) : Boolean {
        return mongoose.Types.ObjectId.isValid(a) && mongoose.Types.ObjectId(a).equals(b);
    }
}

export interface Id extends mongoose.Types.ObjectId {}
export interface Ids {
    isValidId(value: string) : Boolean
    makeId(value: string) : Id
    equal(a: string | Id, b: string | Id) : Boolean
}

export default Ids;

