function createSelections() {
    let selections = $state<string[]>([]);
    let isCorrect = $state<boolean | null>(null);
    let isWrong = $state<boolean | null>(null);
    let partialMatch = $state<{name: string, matchedWords: string[]} | null>(null);

    const checkIfCorrect = (categories: Connection[]) => {
        // Reset states
        isCorrect = null;
        isWrong = null;
        partialMatch = null;

        for (const category of categories) {
            const matchedWords = selections.filter(word => 
                category.wordList.includes(word)
            );

            // Perfect match (existing logic)
            if (matchedWords.length === selections.length && 
                selections.length === category.wordList.length) {
                isCorrect = true;
                console.log("Perfect match!", category.name);
                clear();
                return { perfectMatch: true, category };
            }

            // Partial match (3+ correct words)
            if (matchedWords.length >= 3) {
                partialMatch = {
                    name: category.name,
                    matchedWords
                };
            }
        }

        if (partialMatch) {
            console.log(`Close! You matched ${partialMatch.matchedWords.length} words from ${partialMatch.name}`);
            isWrong = true;
            clear();
            return { 
                perfectMatch: false, 
                partialMatch: partialMatch 
            };
        }

        console.log("Incorrect selection");
        isWrong = true;
        clear();
        return { perfectMatch: false };
    };

    return {
        get current() { return selections },
        clear: () => { 
            selections = [];
            correctWords = [];
            wrongWords = [];
        },
        addToSelections,
        removeFromSelection,
        isSelected: (word: string) => selections.includes(word),
        isCorrect: (word: string) => correctWords.includes(word),
        isWrong: (word: string) => wrongWords.includes(word),
        checkIfCorrect
    };
}