import { EOL } from 'os';
import { readFileSync } from 'fs';
import path from 'path';

const inputDir = path.join(__dirname, "./input");
const input = readFileSync(inputDir, { encoding: "utf8" });

const contents: BagContents = {
    red: 12,
    green: 13,
    blue: 14,
}

type BagContents = {
    red: number,
    green: number,
    blue: number,
};

function sumValidGameIds(input: string): number {
    let lines = input.split(EOL);
    lines = lines.filter(line => line !== ""); 
    const sums = lines.map(getValidSum)
    return sums.reduce((acc, value) => acc + value);
}

function getValidSum(line: string): number {
    const [idString, game] = line.split(":");
    const id = parseInt(idString.split(" ")[1]);
    if (getContents(game)) {
        return id;
    }
    return 0;
}

function getContents(game: string): boolean {
    const sets = game.split(";");
    const setContents = sets.map(getContentsOfSet);
    for (const setContent of setContents) {
        if (!isValidContents(setContent, contents)) {
            return false;
        }
    }
    return true;
}

function getContentsOfSet(set: string): BagContents {
    const values = set.split(",");
    const result = values.reduce<BagContents>((contents, currentValue) => {
        const [, countString, color] = currentValue.split(" ");
        contents[color as keyof BagContents] = parseInt(countString);
        return contents;
    }, { red: 0, green: 0, blue: 0 });    
    return result; 
}

function isValidContents(counted: BagContents, actual: BagContents): boolean {
    for (const color in counted) {
        if (counted[color as keyof BagContents] > actual[color as keyof BagContents]) return false;
    }
    return true;
}

console.log(sumValidGameIds(input));
