<script lang="ts">
    import MistakeCounter from '../components/MistakeCounter.svelte';
    import WordTile from '../components/WordTile.svelte';
    import Category from '../components/Category.svelte';
    import { onMount } from 'svelte';
    import { shuffle } from '../utils/boardUtils';
    import { selections } from '../state/Selections.svelte';
    import { game } from '../state/Game.svelte';
	import type { Connection, ConnectionsType } from '../types/connection';
	import { MatchResult } from '../types/result';

    let { data } = $props<{ payload: ConnectionsType }>();
    let primaryData = $state(data.payload);
    let isLoading = false;
    let SUBSEQUENT_DATA: ConnectionsType | null = $state(null);
    let words = $state<string[]>([]);
    let currentResult = $state<MatchResult | null>(null);
    let foundConnections: Connection[] = $state([]);
    let hasWon = $state(false);

    const INITIAL_WORDS = $derived(primaryData.flatMap(connection => connection.wordList));

    // Initialize words
    $effect(() => {
        words = shuffle([...INITIAL_WORDS]);
    });

    async function fetchNextData() {
        isLoading = true;
        try {
            const response = await fetch("http://localhost:3000/");
            if (!response.ok) throw new Error('Failed to fetch');
            return await response.json();
        } catch (e) {
            console.error('Fetch error:', e);
            return null;
        } finally {
            isLoading = false;
        }
    }

    onMount(async () => {
        SUBSEQUENT_DATA = await fetchNextData();
    });

    async function handleNext() {
        if (!SUBSEQUENT_DATA || isLoading) return;
        primaryData = SUBSEQUENT_DATA;
        resetGame();
        SUBSEQUENT_DATA = await fetchNextData();
    }

    const removeWords = (wordsToRemove: string[]) => {
        words = words.filter(word => !wordsToRemove.includes(word));
    };

    const onRemoveSelection = () => {
        removeWords(selections.current);
        selections.clear();
    };

    const onSubmit = () => {
        currentResult = checkIfCorrect(selections.current);

        if (currentResult.perfectMatch && currentResult.category) {
            foundConnections.push(currentResult.category);
            onRemoveSelection();
            
            if (foundConnections.length === 4) {
                hasWon = true;
                game.toggleWin();
            }
        } else if (currentResult.partialMatch) {
            console.log(`Almost! ${currentResult.partialMatch.matchedWords.length}/4 correct`);
            game.decreaseTries();
        } else {
            game.decreaseTries();
        }
        selections.clear();
    };

    function checkIfCorrect(selectedWords: string[]): MatchResult {
        for (const connection of primaryData) {
            const matchedWords = connection.wordList.filter(word => 
                selectedWords.includes(word)
            );
            
            if (matchedWords.length === 4) {
                return { perfectMatch: true, category: connection };
            } else if (matchedWords.length > 0) {
                return { 
                    perfectMatch: false, 
                    partialMatch: { 
                        matchedWords, 
                        category: connection.category 
                    } 
                };
            }
        }
        return { perfectMatch: false };
    }

    function reshuffle() {
        words = shuffle([...words]);
    }

    const resetGame = () => {
        game.reset();
        foundConnections.length = 0;
        hasWon = false;
    };

    const handleWinAndNext = async () => {
        await handleNext();
    };
</script>

{#if game.status}
    <section>
        <h2>YOU LOST!</h2>
        <button on:click={resetGame}>Try Again</button>
    </section>
{:else if hasWon}
    <section>
        <h2>YOU WIN!</h2>
        <button on:click={handleWinAndNext}>Next round</button>
    </section>
{:else}
    <h2>Create groups of four!</h2>
    <section class="board">
        <div class="container">
            {#each foundConnections as foundConnection}
                <Category {foundConnection} />
            {/each}
            
            {#each words as word}
                <WordTile 
                    {word} 
                    isSelected={selections.isSelected(word)} 
                    onToggle={() => selections.addToSelections(word)}
                />
            {/each}
        </div>
    </section>
    
    <MistakeCounter tries={game.tries} />
    
    <div class="actions">
        <button on:click={reshuffle}>Shuffle</button>
        <button on:click={() => selections.clear()}>Deselect all</button>
        {#if selections.current.length < 4}
            <button id="submit" style="border-color: #979797; color: #979797">Submit</button>
        {:else}
            <button id="submit" on:click={onSubmit}>Submit</button>
        {/if}
    </div>
{/if}
