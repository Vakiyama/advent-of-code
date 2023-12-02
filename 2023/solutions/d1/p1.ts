import { EOL } from "os";
import { readFileSync } from "fs";
import path from "path";

const inputDir = path.join(__dirname, "./input");
const input = readFileSync(inputDir, { encoding: "utf8" });


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
    for (const char of chars) {
        const parsed = parseInt(char);
        if (isNaN(parsed)) continue;
        if (firstNumber === undefined) firstNumber = parsed;
        lastNumber = parsed;
    }
    if (firstNumber === undefined) return 0;
    if (lastNumber === undefined) lastNumber = firstNumber;
    return parseInt(firstNumber.toString() + lastNumber.toString());
}

console.log(input);
const result = getCalibrationNumberSum(input);
console.log(result);
