export interface OmiseInstance {
	setPublicKey(key: string): void;
	createToken(
		type: 'card',
		data: {
			name: string;
			number: string;
			expiration_month: number;
			expiration_year: number;
			security_code: number;
		},
		callback: (statusCode: number, response: any) => void
	): void;
}

// Declare the Omise object globally on the window
declare global {
	interface Window {
		Omise: OmiseInstance;
	}
}

export { OmiseInstance };
