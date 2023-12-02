import { EOL } from "os";
import { readFileSync } from "fs";
import path from "path";

const inputDir = path.join(__dirname, "./input");
const input = readFileSync(inputDir, { encoding: "utf8" });

const digits: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
}

function getCalibrationNumberSum(input: string): number {
    const lines = input.split(EOL);
    const sums: number[] = lines.map(getCalibrationNumber);
    console.log(sums, "sums");
    return sums.reduce((acc, value) => acc + value);
}

function getCalibrationNumber(line: string): number {
    const chars = line.split("");
    let firstNumber: number | undefined = undefined;
    let lastNumber: number | undefined = undefined;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const parsed = parseInt(char);
        const potentialDigit = hasDigit(line.substring(0, i + 1));
        const parsedIsNaN = isNaN(parsed);
        if (parsedIsNaN && !potentialDigit) continue;
        const value = parsedIsNaN ? potentialDigit as number : parsed;
        if (firstNumber === undefined) firstNumber = value;
        lastNumber = value;
    }
    if (firstNumber === undefined) return 0;
    if (lastNumber === undefined) lastNumber = firstNumber;
    return parseInt(firstNumber.toString() + lastNumber.toString());
}

function hasDigit(sequence: string): number | false {
    const validDigits = Object.keys(digits);     
    for (const digit of validDigits) {
        const indexOfDigit = sequence.indexOf(digit);
        if (indexOfDigit === -1) continue;
        const potentialDigit = sequence.substring(sequence.length - digit.length);
        if (potentialDigit === digit) return digits[digit];
    }
    return false;
}

console.log(input);
const result = getCalibrationNumberSum(input);
console.log(result);
