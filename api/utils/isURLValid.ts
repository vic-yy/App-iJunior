export function isURLValid(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch (error) {
		return false;
	}
}

export default isURLValid;