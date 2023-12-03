import { EOL } from 'os';
import { join } from 'path'
import { readFileSync } from 'fs';

/* const input = 
`467..114..
 ...*......
 ..35..633.
 ......#...
 617*......
 .....+.58.
 ..592.....
 ......755.
 ...$.*....
 .664.598..`;
*/

const input = readFileSync(join(__dirname, "input"), "utf8");

const matrix: string[][] = input.split(EOL).map(line => line.split(""));

function sumEngineNumber(input: string): number {
    return matrix.reduce(sumLine, 0);
}

type LineAccumulator = {
    digitAccumulator: string,
    totalSum: number,
    currentLine: number,
}

function sumLine(acc: number, line: string[], index: number): number {
    const lineSum = line.reduce<LineAccumulator>(
        reduceLine,
        { 
            digitAccumulator: "",
            totalSum: 0,
            currentLine: index 
        },
    );
    return acc + lineSum.totalSum;
}

function reduceLine(
    sum: LineAccumulator,
    currentValue: string,
    index: number,
    line: string[]
) {
    if (isParsableNumber(currentValue)) {
        if (!isParsableNumber(line[index + 1])) {
            sum.digitAccumulator += currentValue;
            const amountToAdd = isValidCalibrationNumber(
                index,
                sum.currentLine,
                sum.digitAccumulator
            );
            sum.totalSum += amountToAdd;
            sum.digitAccumulator = "";
            return sum;
        } else {
            sum.digitAccumulator += currentValue;
            return sum;
        }
    }

    return sum;
}

function isValidCalibrationNumber(
    index: number,
    line: number,
    digit: string,
): number {
    const digitLength = digit.length;
    const startIndex = index - digitLength + 1;
    for (let i = startIndex; i < startIndex + digitLength; i++) {
        if (hasSymbolNeighbour(i, line)) return parseInt(digit);
    } 
    return 0;
}

function hasSymbolNeighbour(index: number, line: number): boolean {
    const adjacencyOffsets = [[-1, -1], [-1, 0], [-1, 1],
                              [0, -1],           [0, 1],
                              [1, -1],  [1, 0],  [1, 1]];
    for (const offset of adjacencyOffsets) {
        const newLine = line + offset[0];
        const newIndex = index + offset[1];
        try {
            const charAtPosition = matrix[newLine][newIndex];
            if (charAtPosition === undefined) throw new Error("out of bounds");
            if (!isParsableNumber(charAtPosition) && charAtPosition !== ".") return true;
        } catch(error) {
            continue;
        }
    }
    return false;
}

function isParsableNumber(char: string): boolean {
    return !isNaN(parseInt(char));
}

console.log(sumEngineNumber(input));
