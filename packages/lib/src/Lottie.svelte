<script lang="ts">
	import lottie from 'lottie-web';
	import { onMount } from 'svelte';
    import { lightningLotie } from './lightning';

	export let lottiePath: string;
	export let isAutoplay = false;
	export let isLoop = false;
	export let speed = 1;
	let lottieLogo: any;

	const genRanHex = (size: number) =>
		[...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

	let isLottiePlayed = false;
	let lottieID = lottiePath?.split('/').pop().replace('.', '-') + 'lottie-' + genRanHex(5);
	onMount(() => {
		lottieLogo = lottie.loadAnimation({
			container: document.getElementById(lottieID),
			renderer: 'svg',
			loop: isLoop,
			autoplay: isAutoplay,
		});
		lottieLogo.setSpeed(speed);
	});

	function playLottie() {
		if (!isLottiePlayed) {
			lottieLogo.play();
		} else {
			lottieLogo.stop();
		}
		isLottiePlayed = !isLottiePlayed;
	}
</script>

<div class="lottie-display" on:click={playLottie} id={lottieID} />
