// Simple fruit image system using emoji placeholders
export const FruitImages = {
	getImageUrl(week) {
		const fruitEmojis = {
			1: '🌱', 2: '🌱', 3: '🌱', 4: '🌱',
			5: '🌱', 6: '🫘', 7: '🫐', 8: '🫘',
			9: '🍇', 10: '🍊', 11: '🍊', 12: '🍋',
			13: '🫛', 14: '🍋', 15: '🍎', 16: '🥑',
			17: '🍐', 18: '🍠', 19: '🥭', 20: '🍌',
			21: '🥕', 22: '🍈', 23: '🍊', 24: '🌽',
			25: '🥕', 26: '🧅', 27: '🥬', 28: '🍆',
			29: '🎃', 30: '🥬', 31: '🥥', 32: '🥔',
			33: '🍍', 34: '🍈', 35: '🍈', 36: '🥬',
			37: '🥬', 38: '🧅', 39: '🍉', 40: '🎃'
		};
		
		const emoji = fruitEmojis[week] || '🍎';
		return `data:image/svg+xml,${encodeURIComponent(`
			<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
				<rect width="200" height="200" fill="#f0f9ff" rx="20"/>
				<text x="100" y="120" font-size="80" text-anchor="middle" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">${emoji}</text>
				<text x="100" y="160" font-size="16" text-anchor="middle" fill="#64748b">Week ${week}</text>
			</svg>
		`)}`;
	}
};
