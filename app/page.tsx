import { Button } from '@/shared/ui/Button';

export default function Home() {
	return (
		<main className='flex flex-1 items-center flex-col justify-center pt-20'>
			<section className='text-center'>
				<h1 className='text-5xl font-bold'>FreelanceHub</h1>
				<p className='mt-4 text-gray-500'>Welcome to FreelanceHub!</p>
			</section>
			<section className='flex h-full items-center justify-center pt-5'>
				<Button>Get Started</Button>
			</section>
		</main>
	);
}
