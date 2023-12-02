import { EOL } from 'os';
import { readFileSync } from 'fs';
import path from 'path';

const inputDir = path.join(__dirname, "./input");
const input = readFileSync(inputDir, { encoding: "utf8" });

type BagContents = {
    red: number,
    green: number,
    blue: number,
};

function sumValidGameIds(input: string): number {
    let lines = input.split(EOL);
    lines = lines.filter(line => line !== ""); 
    const sums = lines.map(getPowersetOfMaxValidContents)
    return sums.reduce((acc, value) => acc + value);
}

function getPowersetOfMaxValidContents(line: string): number {
    const [, game] = line.split(":");
    const maxValidContents = getMaxValidContents(game);
    return Object.values(maxValidContents).reduce((acc, currentContents) => acc * currentContents);
           
}

function getMaxValidContents(game: string): BagContents{
    const sets = game.split(";");
    const setContents = sets.map(getContentsOfSet);
    return setContents.reduce<BagContents>((solution, currentSet) => {
        return {
            red: Math.max(solution.red, currentSet.red),
            green: Math.max(solution.green, currentSet.green),
            blue: Math.max(solution.blue, currentSet.blue),
        };
    }, { red: 0, green: 0, blue: 0 });
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
