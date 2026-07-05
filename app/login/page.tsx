import { Button, Card, Divider, Input } from '@/shared/ui';

export default function LoginPage() {
	return (
		<section className='flex flex-1 items-center justify-center py-20'>
			<Card className='w-full max-w-md'>
				<h1 className='text-3xl text-gray-900 font-bold'>Login</h1>

				<p className='mt-2 text-gray-500'>
					Welcome back to FreelanceHub.
				</p>

				<Divider className='my-6' />

				<form className='space-y-4'>
					<Input type='email' placeholder='Email' />

					<Input type='password' placeholder='Password' />

					<Button className='w-full'>Sign In</Button>
				</form>
			</Card>
		</section>
	);
}
