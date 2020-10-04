import mongoose from "mongoose";


const Ids = {
    isValidId(value) {
        return mongoose.Types.ObjectId.isValid(value);
    },    
    makeId() {
        return mongoose.Types.ObjectId();
    }
}


export default Ids;

// export interface IdsHelper {
//     isValidId(value: string) : Boolean,
//     makeId() : Types.ObjectId
// }