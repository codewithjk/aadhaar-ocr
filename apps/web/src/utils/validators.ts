import { MINIMUM_FILE_SIZE } from "../constants";
import { FILE_TYPE_ERROR, LARGE_FILE_ERROR } from "../constants/errorMessage"

const allowedTypes = ['image/jpeg', 'image/png']; // todo: move to constant file


export const baseValidation = (image: File) => {
    console.log(image)
    if (image.size > MINIMUM_FILE_SIZE) {
        throw new Error(LARGE_FILE_ERROR)
    }
    if (!allowedTypes.includes(image.type)) {
        throw new Error(FILE_TYPE_ERROR)
    }
}

export const frontImageValidation = (image: File) => {
    baseValidation(image);
    
}