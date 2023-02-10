<svelte:options tag="ln-tip" />

<script lang="ts">
	// import Lottie from "./Lottie.svelte";
	import { requestInvoice } from "lnurl-pay/dist/umd/index";
	import { QRCodeImage } from "svelte-qrcode-image";

	export let lnaddress: String = 'gandlaf21@stacker.news';
	let amount = 0;
	let isShow = false;
	$: isClick = false;
	let lninvoice = "";
	let isLoadingInvoice = false;
	let hasBeenCopied = false;
	let isConfirm = false;

	const handleClick = () => {
		isClick = !isClick;
		setTimeout(
			() => {
				isShow = !isShow;
			},
			isShow ? 0 : 0
		);
	};

	const handleCancel = () => {
		handleClick();
		amount = 0;
		lninvoice = "";
		isLoadingInvoice = false;
		isConfirm = false;
		hasBeenCopied = false;
		isConfirm = false;
	};

	const handleConfirm = () => {
		isConfirm = true;
	};
	const handleDonate = async () => {
		try {
			isLoadingInvoice = true;
			const { invoice, params, successAction, validatePreimage } =
				await requestInvoice({
					lnUrlOrAddress: lnaddress,
					tokens: amount,
				});
			console.log(params);

			console.log(invoice);
			lninvoice = invoice;
		} catch (e) {
			console.error(e);
		} finally {
			isLoadingInvoice = false;
		}
	};
	const handleCharge = async (delay = 200) => {
		console.log("mouse down");

		if (amount < 10) {
			amount = amount + 1;
			delay = 100;
		} else if (amount < 50) {
			amount = amount + 5;
			delay = 100;
		} else if (amount < 100) {
			amount = amount + 5;
			delay = 50;
		} else if (amount < 500) {
			amount = amount + 10;
		} else if (amount < 5000) {
			amount = amount + 100;
			delay = 50;
		} else if (amount < 50000) {
			amount = amount + 1000;
		} else {
			amount = amount + 10000;
		}

		if (!isClick) {
			await setTimeout(() => {
				handleCharge(delay);
			}, delay);
		}
	};
	const copyInvoice = () => {
		let input = document.getElementById("invoice-input");
		// @ts-expect-error
		input.select();
		document.execCommand("copy");
		hasBeenCopied = true;
	};
</script>

<div class="w-96 h-72 flex items-center justify-center" data-theme="light">
	{#if isShow}
		<div class="card bg-base-100 shadow-xl h-72 w-96 z-50 absolute">
			<div class="card-body h-full">
				<h2 class="card-title">Donate to {lnaddress.split("@")[0]}</h2>
				{#if lninvoice}
					{#if isConfirm}
						<div
							class="flex flex-col items-center justify-center gap-2 h-full"
						>
							<div>
								<p>Thank You!</p>
							</div>
							<div class="btn btn-success btn-square">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						</div>
					{:else}
						<div
							class="flex w-full h-full gap-2 bg-base-300 p-2 rounded-lg"
						>
							<a class="w-36 h-36" href="lightning:{lninvoice}">
								<QRCodeImage displayHeight={'144px'} text={lninvoice} />
							</a>
							<div
								class="flex-col flex gap-2 h-full justify-between"
							>
								<div class="font-bold">
									<p>Scan & Pay</p>
								</div>

								<div class="flex gap-2">
									<input
										id="invoice-input"
										type="text"
										class="input input-primary w-20"
										readonly
										bind:value={lninvoice}
									/>
									<div
										class="tooltip"
										data-tip={hasBeenCopied
											? "copied!"
											: "copy"}
									>
										<button
											class="btn btn-square"
											on:click={copyInvoice}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="w-6 h-6"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
												/>
											</svg>
										</button>
									</div>
								</div>
								<div class="grid grid-cols-4 overflow-clip">
									<p class="font-bold col-span-2 truncate">
										Amount:
									</p>
									<p
										class="col-span-2 inline-flex gap-1 items-center"
									>
										{amount}
										<span class="h-4 w-4">
											<svg
												class="w-4 h-4"
												stroke="currentColor"
												fill="currentColor"
												id="Layer_1"
												data-name="Layer 1"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 360 360"
												><rect
													x="166.06"
													y="2.83"
													width="27.89"
													height="47.65"
												/><rect
													x="166.06"
													y="310.35"
													width="27.89"
													height="47.65"
												/><rect
													x="166.06"
													y="6.84"
													width="27.89"
													height="198.86"
													transform="translate(286.28 -73.74) rotate(90)"
												/><rect
													x="166.06"
													y="80.5"
													width="27.89"
													height="198.86"
													transform="translate(359.94 -0.08) rotate(90)"
												/><rect
													x="166.06"
													y="152.08"
													width="27.89"
													height="198.86"
													transform="translate(431.52 71.5) rotate(90)"
												/></svg
											>
										</span>
									</p>
								</div>
							</div>
						</div>
					{/if}
				{:else}
					<div class="flex flex-col h-full">
						<p class="inline-flex items-center gap-1">
							<span> Donate </span>
							<input
								type="text"
								class="input input-primary input-sm w-16
                            "
								bind:value={amount}
							/>
							<span class="h-4 w-4">
								<svg
									class="w-4 h-4"
									stroke="currentColor"
									fill="currentColor"
									id="Layer_1"
									data-name="Layer 1"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 360 360"
									><rect
										x="166.06"
										y="2.83"
										width="27.89"
										height="47.65"
									/><rect
										x="166.06"
										y="310.35"
										width="27.89"
										height="47.65"
									/><rect
										x="166.06"
										y="6.84"
										width="27.89"
										height="198.86"
										transform="translate(286.28 -73.74) rotate(90)"
									/><rect
										x="166.06"
										y="80.5"
										width="27.89"
										height="198.86"
										transform="translate(359.94 -0.08) rotate(90)"
									/><rect
										x="166.06"
										y="152.08"
										width="27.89"
										height="198.86"
										transform="translate(431.52 71.5) rotate(90)"
									/></svg
								>
							</span>
						</p>
						<p>
							<span> to </span>
							<span class="link">
								{lnaddress}
							</span>
						</p>
					</div>
				{/if}
				<div class="card-actions justify-end items-end">
					<button
						class="btn btn-outline btn-sm"
						on:click={handleCancel}>cancel</button
					>
					{#if lninvoice}
						{#if isConfirm}
							<button
								class="btn btn-success btn-sm"
								on:click={handleCancel}>Ok</button
							>
						{:else}
							<button
								class="btn btn-success btn-sm"
								on:click={handleConfirm}>Confirm</button
							>
						{/if}
					{:else if isLoadingInvoice}
						<button class="btn btn-square loading btn-sm" />
					{:else}
						<button
							class="btn btn-primary btn-sm"
							on:click={handleDonate}>Donate</button
						>
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<div class="w-32 h-32 z-10 flex items-center justify-center ">
			<div
				class="tooltip tooltip-open tooltip-secondary z-10"
				data-tip={amount ? amount + " sats" : "hold to donate"}
			>
				<button
					class="w-16 h-16 btn btn-warning btn-square"
					on:mouseup={handleClick}
					on:mousedown={handleCharge}

          on:touchstart={handleCharge}
          on:touchend={handleClick}
				>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
				  </svg>
				  
					<!-- <Lottie
						lottiePath="lightning.json"
						isAutoplay={false}
						isLoop={false}
					/> -->
				</button>
			</div>
		</div>
	{/if}
</div>


<style>
	/*
! tailwindcss v3.2.4 | MIT License | https://tailwindcss.com
*/

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box;
  /* 1 */
  border-width: 0;
  /* 2 */
  border-style: solid;
  /* 2 */
  border-color: #e5e7eb;
  /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured `sans` font-family by default.
5. Use the user's configured `sans` font-feature-settings by default.
*/

div {
  line-height: 1.5;
  /* 1 */
  -webkit-text-size-adjust: 100%;
  /* 2 */
  -moz-tab-size: 4;
  /* 3 */
  -o-tab-size: 4;
     tab-size: 4;
  /* 3 */
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* 4 */
  font-feature-settings: normal;
  /* 5 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
*/

div {
  margin: 0;
  /* 1 */
  line-height: inherit;
  /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/


/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}



/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input
 {
  font-family: inherit;
  /* 1 */
  font-size: 100%;
  /* 1 */
  font-weight: inherit;
  /* 1 */
  line-height: inherit;
  /* 1 */
  color: inherit;
  /* 1 */
  margin: 0;
  /* 2 */
  padding: 0;
  /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button;
  /* 1 */
  background-color: transparent;
  /* 2 */
  background-image: none;
  /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}


/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield;
  /* 1 */
  outline-offset: -2px;
  /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to `inherit` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button;
  /* 1 */
  font: inherit;
  /* 2 */
}


/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  /* 1 */
  vertical-align: middle;
  /* 2 */
}


[hidden] {
  display: none;
}

:root,
[data-theme] {
  background-color: hsla(var(--b1) / var(--tw-bg-opacity, 1));
  color: hsla(var(--bc) / var(--tw-text-opacity, 1));
}

html {
  -webkit-tap-highlight-color: transparent;
}

:root {
  color-scheme: light;
  --pf: 258.89 94.378% 40.941%;
  --sf: 314 100% 37.647%;
  --af: 174 60% 40.784%;
  --nf: 219 14.085% 22.275%;
  --in: 198 93% 60%;
  --su: 158 64% 52%;
  --wa: 43 96% 56%;
  --er: 0 91% 71%;
  --inc: 198 100% 12%;
  --suc: 158 100% 10%;
  --wac: 43 100% 11%;
  --erc: 0 100% 14%;
  --rounded-box: 1rem;
  --rounded-btn: 0.5rem;
  --rounded-badge: 1.9rem;
  --animation-btn: 0.25s;
  --animation-input: .2s;
  --btn-text-case: uppercase;
  --btn-focus-scale: 0.95;
  --border-btn: 1px;
  --tab-border: 1px;
  --tab-radius: 0.5rem;
  --p: 258.89 94.378% 51.176%;
  --pc: 0 0% 100%;
  --s: 314 100% 47.059%;
  --sc: 0 0% 100%;
  --a: 174 60% 50.98%;
  --ac: 174.71 43.59% 15.294%;
  --n: 219 14.085% 27.843%;
  --nc: 0 0% 100%;
  --b1: 0 0% 100%;
  --b2: 0 0% 94.902%;
  --b3: 180 1.9608% 90%;
  --bc: 215 27.907% 16.863%;
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --pf: 262.35 80.315% 40.157%;
    --sf: 315.75 70.196% 40%;
    --af: 174.69 70.335% 32.784%;
    --in: 198 93% 60%;
    --su: 158 64% 52%;
    --wa: 43 96% 56%;
    --er: 0 91% 71%;
    --inc: 198 100% 12%;
    --suc: 158 100% 10%;
    --wac: 43 100% 11%;
    --erc: 0 100% 14%;
    --rounded-box: 1rem;
    --rounded-btn: 0.5rem;
    --rounded-badge: 1.9rem;
    --animation-btn: 0.25s;
    --animation-input: .2s;
    --btn-text-case: uppercase;
    --btn-focus-scale: 0.95;
    --border-btn: 1px;
    --tab-border: 1px;
    --tab-radius: 0.5rem;
    --p: 262.35 80.315% 50.196%;
    --pc: 0 0% 100%;
    --s: 315.75 70.196% 50%;
    --sc: 0 0% 100%;
    --a: 174.69 70.335% 40.98%;
    --ac: 0 0% 100%;
    --n: 218.18 18.033% 11.961%;
    --nf: 222.86 17.073% 8.0392%;
    --nc: 220 13.376% 69.216%;
    --b1: 220 17.647% 20%;
    --b2: 220 17.241% 17.059%;
    --b3: 218.57 17.949% 15.294%;
    --bc: 220 13.376% 69.216%;
  }
}

[data-theme=light] {
  color-scheme: light;
  --pf: 258.89 94.378% 40.941%;
  --sf: 314 100% 37.647%;
  --af: 174 60% 40.784%;
  --nf: 219 14.085% 22.275%;
  --in: 198 93% 60%;
  --su: 158 64% 52%;
  --wa: 43 96% 56%;
  --er: 0 91% 71%;
  --inc: 198 100% 12%;
  --suc: 158 100% 10%;
  --wac: 43 100% 11%;
  --erc: 0 100% 14%;
  --rounded-box: 1rem;
  --rounded-btn: 0.5rem;
  --rounded-badge: 1.9rem;
  --animation-btn: 0.25s;
  --animation-input: .2s;
  --btn-text-case: uppercase;
  --btn-focus-scale: 0.95;
  --border-btn: 1px;
  --tab-border: 1px;
  --tab-radius: 0.5rem;
  --p: 258.89 94.378% 51.176%;
  --pc: 0 0% 100%;
  --s: 314 100% 47.059%;
  --sc: 0 0% 100%;
  --a: 174 60% 50.98%;
  --ac: 174.71 43.59% 15.294%;
  --n: 219 14.085% 27.843%;
  --nc: 0 0% 100%;
  --b1: 0 0% 100%;
  --b2: 0 0% 94.902%;
  --b3: 180 1.9608% 90%;
  --bc: 215 27.907% 16.863%;
}


*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}


.btn {
  display: inline-flex;
  flex-shrink: 0;
  cursor: pointer;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border-color: transparent;
  border-color: hsl(var(--n) / var(--tw-border-opacity));
  text-align: center;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--rounded-btn, 0.5rem);
  height: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  line-height: 1em;
  min-height: 3rem;
  font-weight: 600;
  text-transform: uppercase;
  text-transform: var(--btn-text-case, uppercase);
  text-decoration-line: none;
  border-width: var(--border-btn, 1px);
  animation: button-pop var(--animation-btn, 0.25s) ease-out;
  --tw-border-opacity: 1;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--n) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--nc) / var(--tw-text-opacity));
}

.btn-square {
  height: 3rem;
  width: 3rem;
  padding: 0px;
}

.btn.loading,
    .btn.loading:hover {
  pointer-events: none;
}

.btn.loading:before {
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  border-radius: 9999px;
  border-width: 2px;
  animation: spin 2s linear infinite;
  content: "";
  border-top-color: transparent;
  border-left-color: transparent;
  border-bottom-color: currentColor;
  border-right-color: currentColor;
}

@media (prefers-reduced-motion: reduce) {
  .btn.loading:before {
    animation: spin 10s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}


.card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--rounded-box, 1rem);
}

.card:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.card-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: var(--padding-card, 2rem);
  gap: 0.5rem;
}

.card-body :where(p) {
  flex-grow: 1;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.5rem;
}

.input {
  flex-shrink: 1;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  height: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 1rem;
  line-height: 2;
  line-height: 1.5rem;
  border-width: 1px;
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  --tw-border-opacity: 0;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
  border-radius: var(--rounded-btn, 0.5rem);
}

.link {
  cursor: pointer;
  text-decoration-line: underline;
}


.tooltip {
  position: relative;
  display: inline-block;
  --tooltip-offset: calc(100% + 1px + var(--tooltip-tail, 0px));
  text-align: center;
  --tooltip-tail: 3px;
  --tooltip-color: hsl(var(--n));
  --tooltip-text-color: hsl(var(--nc));
  --tooltip-tail-offset: calc(100% + 1px - var(--tooltip-tail));
}

.tooltip:before {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  content: var(--tw-content);
  --tw-content: attr(data-tip);
  max-width: 20rem;
  border-radius: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  background-color: var(--tooltip-color);
  color: var(--tooltip-text-color);
  width: -moz-max-content;
  width: max-content;
}

.tooltip:before, .tooltip-top:before {
  transform: translateX(-50%);
  top: auto;
  left: 50%;
  right: auto;
  bottom: var(--tooltip-offset);
}


.btn:active:hover,
  .btn:active:focus {
  animation: none;
  transform: scale(var(--btn-focus-scale, 0.95));
}

.btn:hover,
    .btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--nf, var(--n)) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--nf, var(--n)) / var(--tw-bg-opacity));
}

.btn:focus-visible {
  outline: 2px solid hsl(var(--nf));
  outline-offset: 2px;
}

.btn-primary {
  --tw-border-opacity: 1;
  border-color: hsl(var(--p) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--p) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--pc) / var(--tw-text-opacity));
}

.btn-primary:hover,
    .btn-primary.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--pf, var(--p)) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--pf, var(--p)) / var(--tw-bg-opacity));
}

.btn-primary:focus-visible {
  outline: 2px solid hsl(var(--p));
}

.btn-success {
  --tw-border-opacity: 1;
  border-color: hsl(var(--su) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--su) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--suc, var(--nc)) / var(--tw-text-opacity));
}

.btn-success:hover,
    .btn-success.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--su) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--su) / var(--tw-bg-opacity));
}

.btn-success:focus-visible {
  outline: 2px solid hsl(var(--su));
}

.btn-warning {
  --tw-border-opacity: 1;
  border-color: hsl(var(--wa) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--wa) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--wac, var(--nc)) / var(--tw-text-opacity));
}

.btn-warning:hover,
    .btn-warning.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--wa) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--wa) / var(--tw-bg-opacity));
}

.btn-warning:focus-visible {
  outline: 2px solid hsl(var(--wa));
}

.btn-outline {
  border-color: currentColor;
  background-color: transparent;
  --tw-text-opacity: 1;
  color: hsl(var(--bc) / var(--tw-text-opacity));
}

.btn-outline:hover,
    .btn-outline.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--bc) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--b1) / var(--tw-text-opacity));
}



.btn.loading.btn-square:before,
    .btn.loading.btn-circle:before {
  margin-right: 0px;
}

.btn.loading.btn-xl:before,
    .btn.loading.btn-lg:before {
  height: 1.25rem;
  width: 1.25rem;
}

.btn.loading.btn-sm:before,
    .btn.loading.btn-xs:before {
  height: 0.75rem;
  width: 0.75rem;
}

.btn-group > input[type="radio"]:checked.btn,
  .btn-group > .btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--p) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--p) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--pc) / var(--tw-text-opacity));
}

.btn-group > input[type="radio"]:checked.btn:focus-visible, .btn-group > .btn-active:focus-visible {
  outline: 2px solid hsl(var(--p));
}

@keyframes button-pop {
  0% {
    transform: scale(var(--btn-focus-scale, 0.95));
  }

  40% {
    transform: scale(1.02);
  }

  100% {
    transform: scale(1);
  }
}

.card :where(figure:first-child) {
  overflow: hidden;
  border-start-start-radius: inherit;
  border-start-end-radius: inherit;
  border-end-start-radius: unset;
  border-end-end-radius: unset;
}

.card :where(figure:last-child) {
  overflow: hidden;
  border-start-start-radius: unset;
  border-start-end-radius: unset;
  border-end-start-radius: inherit;
  border-end-end-radius: inherit;
}

.card:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
}


@keyframes checkmark {
  0% {
    background-position-y: 5px;
  }

  50% {
    background-position-y: -2px;
  }

  100% {
    background-position-y: 0;
  }
}

.input:focus {
  outline: 2px solid hsla(var(--bc) / 0.2);
  outline-offset: 2px;
}

.input-primary {
  --tw-border-opacity: 1;
  border-color: hsl(var(--p) / var(--tw-border-opacity));
}

.input-primary:focus {
  outline: 2px solid hsl(var(--p));
}

.link:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}


.tooltip:before,
.tooltip:after {
  opacity: 0;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-delay: 100ms;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip:after {
  position: absolute;
  content: "";
  border-style: solid;
  border-width: var(--tooltip-tail, 0);
  width: 0;
  height: 0;
  display: block;
}

.tooltip.tooltip-open:before,
.tooltip.tooltip-open:after,
.tooltip:hover:before,
.tooltip:hover:after {
  opacity: 1;
  transition-delay: 75ms;
}

.tooltip:not([data-tip]):hover:before,
.tooltip:not([data-tip]):hover:after {
  visibility: hidden;
  opacity: 0;
}

.tooltip:after, .tooltip-top:after {
  transform: translateX(-50%);
  border-color: var(--tooltip-color) transparent transparent transparent;
  top: auto;
  left: 50%;
  right: auto;
  bottom: var(--tooltip-tail-offset);
}

.tooltip-secondary {
  --tooltip-color: hsl(var(--s));
  --tooltip-text-color: hsl(var(--sc));
}



.btn-sm {
  height: 2rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  min-height: 2rem;
  font-size: 0.875rem;
}



.btn-square:where(.btn-xs) {
  height: 1.5rem;
  width: 1.5rem;
  padding: 0px;
}

.btn-square:where(.btn-sm) {
  height: 2rem;
  width: 2rem;
  padding: 0px;
}

.btn-square:where(.btn-md) {
  height: 3rem;
  width: 3rem;
  padding: 0px;
}

.btn-square:where(.btn-lg) {
  height: 4rem;
  width: 4rem;
  padding: 0px;
}


.input-sm {
  height: 2rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  font-size: 0.875rem;
  line-height: 2rem;
}


.absolute {
  position: absolute;
}



.z-50 {
  z-index: 50;
}

.z-10 {
  z-index: 10;
}

.col-span-2 {
  grid-column: span 2 / span 2;
}

.flex {
  display: flex;
}

.inline-flex {
  display: inline-flex;
}

.grid {
  display: grid;
}


.hidden {
  display: none;
}

.h-72 {
  height: 18rem;
}

.h-full {
  height: 100%;
}

.h-6 {
  height: 1.5rem;
}

.h-36 {
  height: 9rem;
}

.h-4 {
  height: 1rem;
}

.h-32 {
  height: 8rem;
}

.h-16 {
  height: 4rem;
}

.w-96 {
  width: 24rem;
}

.w-6 {
  width: 1.5rem;
}

.w-full {
  width: 100%;
}

.w-36 {
  width: 9rem;
}

.w-20 {
  width: 5rem;
}

.w-4 {
  width: 1rem;
}

.w-16 {
  width: 4rem;
}

.w-32 {
  width: 8rem;
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.flex-col {
  flex-direction: column;
}


.items-end {
  align-items: flex-end;
}

.items-center {
  align-items: center;
}

.justify-end {
  justify-content: flex-end;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-1 {
  gap: 0.25rem;
}

.overflow-clip {
  overflow: clip;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.border {
  border-width: 1px;
}

.bg-base-100 {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
}

.bg-base-300 {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b3, var(--b2)) / var(--tw-bg-opacity));
}

.p-2 {
  padding: 0.5rem;
}

.p-0 {
  padding: 0px;
}

.px-0 {
  padding-left: 0px;
  padding-right: 0px;
}

.font-bold {
  font-weight: 700;
}

.uppercase {
  text-transform: uppercase;
}

.underline {
  text-decoration-line: underline;
}

.shadow-xl {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.outline {
  outline-style: solid;
}

.blur {
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.backdrop-filter {
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}

.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

</style>