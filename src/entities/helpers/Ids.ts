import mongoose from "mongoose";

export interface IdsHelper {
    isValidId(value: string) : Boolean,
    makeId() : string
}

const Ids = {
    isValidId(value) {
        return mongoose.Types.ObjectId.isValid(value);
    },    
    makeId() {
        return `${mongoose.Types.ObjectId()}`;
    }
}

export default Ids;

