import { Ids } from '../domain/entities/entity.depend.interfaces';
import mongoose from "mongoose";

const Ids: Ids = {
    isValidId(value) {
        return mongoose.Types.ObjectId.isValid(value);
    },    
    makeId() {
        return mongoose.Types.ObjectId();  
    }
}

export interface Id extends mongoose.Types.ObjectId {}

export default Ids;

