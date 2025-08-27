<script lang="ts">
    export let word: string;
    export let isSelected: boolean;
    export let onToggle: () => void;
</script>

<button 
    class:selected={isSelected}
    class:isCorrect={isCorrect === true}
    class:isWrong={isWrong === true}
    on:click={() => onToggle(word)}
>
    {word}
</button>

<style>
    button {
        padding: 1rem;
        border: 2px solid #ccc;
        background: white;
        cursor: pointer;
        border-radius: 6px;
        text-align: center;
        font-weight: 500;
        transition: all 0.2s;
    }
    
    button:hover {
        border-color: #666;
    }
    
    button.selected {
        border-color: #000;
        background: #f0f0f0;
    }
</style>