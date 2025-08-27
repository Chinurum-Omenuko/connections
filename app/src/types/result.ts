export type MatchResult = {
    perfectMatch: boolean;
    category?: Connection;
    partialMatch?: {
        matchedWords: string[];
        category: string;
    };
};