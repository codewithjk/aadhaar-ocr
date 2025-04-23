import { FILE_TYPE_ERROR, LARGE_FILE_ERROR } from "../constants/errorMessage";
import { baseValidation } from "./validators";

const createMockFile = (options: Partial<File> = {}): File => {
    return {
        name: "front_sample.png",
        size: 1024,
        type: "image/png",
        ...options,
    } as File;
};

describe("Base Validation ", () => {
   
    it("Throw error if file is too large", () => {
        const file = createMockFile({ size: 500001});
        expect(()=>baseValidation(file)).toThrow(LARGE_FILE_ERROR)
    });
    it("Don't throw error if file is in limited size", () => {
        const file = createMockFile({ size: 500000 });
        expect(()=>baseValidation(file)).not.toThrow()
    });
    it("passes for valid PNG type", () => {
        const file = createMockFile({ type: "image/png" });
        expect(() => baseValidation(file)).not.toThrow();
    });

    it("passes for valid JPEG type", () => {
        const file = createMockFile({ type: "image/jpeg" });
        expect(() => baseValidation(file)).not.toThrow();
    });

    it("throws error for unsupported file type", () => {
        const file = createMockFile({ type: "application/pdf" });
        expect(() => baseValidation(file)).toThrow(FILE_TYPE_ERROR);
    });

    it("throws error if file type is missing", () => {
        const file = createMockFile({ type: "" });
        expect(() => baseValidation(file)).toThrow(FILE_TYPE_ERROR);
    });


})