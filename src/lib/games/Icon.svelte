<script lang="ts">
	import { Color, Carta } from './blackjack';

	export let color: Color;
	let classes: string = '';
	let styles: string = '';

	export { classes as class, styles as style };

	//let { color, symbol, clase = "" }: { color: Color, symbol: Carta, clase: string } = $props();

	let icons = [
		{
			box: 512,
			svg: `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M458.915 307.705c0 62.63-54 91.32-91.34 91.34-41.64 0-73.1-18.86-91.83-34.26 2.47 50.95 14.53 87.35 68.65 116h-176.79c54.12-28.65 66.18-65.05 68.65-116-18.73 15.39-50.2 34.28-91.83 34.26-37.29 0-91.34-28.71-91.34-91.34 0-114.47 80.64-83.32 202.91-276.49 122.28 193.17 202.92 162.03 202.92 276.49z"></path></g></svg>`,
			name: 'spade'
		},
		{
			box: 16,
			svg: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#e01b24"></path></g></svg>`,
			name: 'heart'
		},
		{
			box: 512,
			svg: `<svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#e01b24;} </style> <g> <polygon class="st0" points="256,0 72.115,256 256,512 439.885,256 "></polygon> </g> </g></svg>`,
			name: 'diamond'
		},
		{
			box: 512,
			svg: `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M477.443 295.143a104.45 104.45 0 0 1-202.26 36.67c-.08 68.73 4.33 114.46 69.55 149h-177.57c65.22-34.53 69.63-80.25 69.55-149a104.41 104.41 0 1 1-66.34-136.28 104.45 104.45 0 1 1 171.14 0 104.5 104.5 0 0 1 135.93 99.61z"></path></g></svg>`,
			name: 'club'
		}
	];

	let displayIcon;

	switch (color) {
		case Color.SPADES:
			displayIcon = icons[0];
			break;

		case Color.HEARTS:
			displayIcon = icons[1];
			break;

		case Color.DIAMONDS:
			displayIcon = icons[2];
			break;

		case Color.CLOVERS:
			displayIcon = icons[3];
			break;
	}
</script>

<svg style={styles} class={classes} viewBox="0 0 {displayIcon.box} {displayIcon.box}">
	{@html displayIcon.svg}
</svg>
