'use client';

import { ErrorState } from '@/shared/ui';

type ErrorPageProps = {
	error: Error & {
		digest?: string;
	};
	reset: () => void;
};

export default function Error({ error, reset }: ErrorPageProps) {
	return <ErrorState error={error} reset={reset} />;
}
