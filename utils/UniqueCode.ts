export function generateCombinations(characters: string[], length: number): string[][] {
    if (length === 0) return [[]];
    
    const result: string[][] = [];
    const smallerCombinations: string[][] = generateCombinations(characters, length - 1);
    
    for (const char of characters) {
        for (const combination of smallerCombinations) {
            result.push([char, ...combination]);
        }
    }
    
    return result;
}

export function generateUniqueRepresentations(inputNumber: number): string {
    const characters: string[] = ['A', 'B', 'C'];
    let currentId: number = 1;
    let maxLength: number = 1;
    
    while (currentId <= inputNumber) {
        const allCombinations: string[][] = generateCombinations(characters, maxLength);

        for (const combination of allCombinations) {
            if (currentId > inputNumber) break;
            const representation: string = combination.join('');
            if (currentId === inputNumber) {
                return representation;
            }
            currentId++;
        }
        maxLength++; // Increase the length for the next round
    }

    return "Input number out of range";
}
