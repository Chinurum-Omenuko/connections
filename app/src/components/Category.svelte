<script lang="ts">
    import type { Connection } from '../types/connection';
    
    export let categoryData: Connection;
</script>

<div class="category">
    <h3>{categoryData.category}</h3>
    <div class="words">
        {#each categoryData.wordList as word}
            <span class="word">{word}</span>
        {/each}
    </div>
</div>

<style>
    .category {
        padding: 1rem;
        border: 2px solid #000;
        border-radius: 8px;
        background: #f8f8f8;
        grid-column: span 4;
    }
    
    h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        color: #333;
    }
    
    .words {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .word {
        padding: 0.25rem 0.5rem;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.9rem;
    }
</style>