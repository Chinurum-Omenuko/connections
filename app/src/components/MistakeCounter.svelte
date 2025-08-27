<script lang="ts">
    export let tries: number;
</script>

<div class="mistake-counter">
    {#each Array(4).fill(0) as _, i}
        <div class="circle {i >= tries ? 'used' : ''}"></div>
    {/each}
</div>

<style>
    .mistake-counter {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        margin: 1rem 0;
    }
    
    .circle {
        width: 20px;
        height: 20px;
        border: 2px solid #000;
        border-radius: 50%;
    }
    
    .circle.used {
        background: #000;
    }
</style>