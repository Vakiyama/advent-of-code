import { EOL } from 'os';
import { join } from 'path'
import { readFileSync } from 'fs';

const input = readFileSync(join(__dirname, "input"), "utf8");
const matrix: string[][] = input.split(EOL).map(line => line.split(""));

function sumEngineNumber(): number {
    return matrix.reduce(sumLine, 0);
}

type LineAccumulator = {
    totalSum: number,
    currentLine: number,
}

function sumLine(acc: number, line: string[], index: number): number {
    const lineSum = line.reduce<LineAccumulator>(
        reduceLine,
        { 
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
) {
    if (currentValue === "*") {
        // check for gear ratios around
        const total = multiplySurroundingPartNumbers(index, sum.currentLine);
        sum.totalSum += total;
    }

    return sum;
}

function multiplySurroundingPartNumbers(
    index: number,
    line: number
): number {
    const partNumbers = getSurroundingPartNumbers(index, line);
    if (partNumbers.length === 2) {
        const result = partNumbers[0] * partNumbers[1];
        console.log(result, partNumbers);
        return partNumbers[0] * partNumbers[1];
    }
    return 0;
}

function getSurroundingPartNumbers(
    index: number,
    line: number,
): number[] {
    const surroundingNumbers = getSurroundingNumberIndexes(index, line); 
    const constructedNumbers = surroundingNumbers.reduce<ConstructedNumber[]>(reduceToSet, [])
    return constructedNumbers.map(construct => construct.value);
}

type ConstructedNumber = {
    startIndex: number,
    endIndex: number,
    lineNumber: number,
    value: number,
};

function reduceToSet(numbers: ConstructedNumber[], currentCoordinate: Coordinate) {
    const constructed = constructNumber(currentCoordinate);
    for (const number of numbers) {
        if (isEqualConstructedNumber(constructed, number)) return numbers;
    }
    numbers.push(constructed);
    return numbers;
}

function isEqualConstructedNumber(number: ConstructedNumber, compareNumber: ConstructedNumber): boolean {
    return number.value === compareNumber.value &&
            number.endIndex === number.endIndex &&
            number.startIndex === number.startIndex &&
            number.lineNumber === number.lineNumber;
}

function constructNumber(coordinate: Coordinate): ConstructedNumber {
    // crawl left and right until we find the start and end indexes
    let startIndex = undefined;
    let endIndex = undefined;
    let currentIndex = coordinate.index;
    while (startIndex === undefined) {
        currentIndex--; 
        const char = getCharAtCoordinates({ line: coordinate.line, index: currentIndex });
        if (!isParsableNumber(char)) {
            startIndex = currentIndex;
            currentIndex = coordinate.index;
        }
    }
    while (endIndex === undefined) {
        currentIndex++; 
        const char = getCharAtCoordinates({ line: coordinate.line, index: currentIndex });
        if (!isParsableNumber(char)) {
            endIndex = currentIndex;
        }
    }

    const value = matrix[coordinate.line]
        .slice(startIndex + 1, endIndex)
        .reduce((acc, value) => acc.toString() + value.toString());
    return {
        startIndex,
        endIndex,
        lineNumber: coordinate.line,
        value: parseInt(value)
    }
}

type Coordinate = {
    line: number,
    index: number,
}

function getSurroundingNumberIndexes(
    index: number,
    line: number,
): Coordinate[] {
    const adjacencyCoordinates = getAdjacencyCoordinates(index, line);
    const indexes = [];
    for (const coordinate of adjacencyCoordinates) {
        const char = getCharAtCoordinates(coordinate);
        if (isParsableNumber(char)) {
            indexes.push(coordinate);
        }
    }
    return indexes;
}

function getCharAtCoordinates(
    coordinate: Coordinate,
): string {
    return matrix[coordinate.line][coordinate.index];
}

function getAdjacencyCoordinates(
    index: number,
    line: number,
): Coordinate[] {
    const adjacencyOffsets = [[-1, -1], [-1, 0], [-1, 1],
                              [0, -1],           [0, 1],
                              [1, -1],  [1, 0],  [1, 1]];
    const offsetCoordinates: Coordinate[] = [];
    for (const offset of adjacencyOffsets) {
        const newIndex = index + offset[0];
        const newLine = line + offset[1];
        offsetCoordinates.push({ index: newIndex, line: newLine });
    }
    return offsetCoordinates;
}



function isParsableNumber(char: string): boolean {
    return !isNaN(parseInt(char)) && char !== undefined;
}

console.log(sumEngineNumber());
