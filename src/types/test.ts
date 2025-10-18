// TypeScript equivalent of C# TestDto
export interface TestDto {
    testccdmat: TestCcdmat;
    testccdmas: TestCcdmas;
}

// TypeScript equivalent of C# testccdmat
export interface TestCcdmat {
    cccdmt: number;
    formFilecccd: File; // File is the TypeScript equivalent of IFormFile
}

// TypeScript equivalent of C# testccdmas
export interface TestCcdmas {
    cccdms: number;
    formFilecccdms: File; // File is the TypeScript equivalent of IFormFile
}

// Keep the original test type for backward compatibility
export type test = {
    name: string;
    age: number;
}