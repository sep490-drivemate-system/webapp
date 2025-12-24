export interface TestDto {
    testccdmat: TestCcdmat;
    testccdmas: TestCcdmas;
}

export interface TestCcdmat {
    cccdmt: number;
    formFilecccd: File;
}

export interface TestCcdmas {
    cccdms: number;
    formFilecccdms: File;
}

export type test = {
    name: string;
    age: number;
}