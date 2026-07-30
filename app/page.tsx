'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/shared/ui';
export default function HomePage() {
	return (
		<main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4'>
			{/* Background */}
			<div className='absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-black' />

			{/* Aurora */}
			<motion.div
				animate={{
					x: [0, 120, 0],
					y: [0, -60, 0],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
				className='absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl md:h-[430px] md:w-[430px]'
			/>

			<motion.div
				animate={{
					x: [0, -120, 0],
					y: [0, 80, 0],
				}}
				transition={{
					duration: 22,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
				className='absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl md:h-[470px] md:w-[470px]'
			/>

			{/* Grid */}
			<div
				className='absolute inset-0 opacity-10'
				style={{
					backgroundImage:
						'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
					backgroundSize: '50px 50px',
				}}
			/>

			{/* Content */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
				className='relative z-10 w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl sm:p-10'
			>
				<p className='text-xs uppercase tracking-[0.4em] text-cyan-300 sm:text-sm'>
					Welcome To
				</p>

				<div className='mt-6 flex justify-center gap-3'>
					<Link href='/login'>
						<Button className='border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500 hover:text-white'>
							Login
						</Button>
					</Link>

					<Link href='/register'>
						<Button className='border border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-300 hover:bg-fuchsia-500 hover:text-white'>
							Register
						</Button>
					</Link>
				</div>

				<h1 className='mt-8 bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent xs:text-5xl sm:text-6xl lg:text-7xl'>
					FreelanceHub
				</h1>

				<div className='mx-auto my-8 h-1 w-40 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500' />

				<h2 className='text-2xl font-bold text-white sm:text-4xl'>
					Modern Full-Stack Freelance Marketplace
				</h2>

				<p className='mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8'>
					Connect talented freelancers with clients around the world.
					Find exciting projects, showcase your skills and build your
					career using a modern platform designed for developers,
					designers and digital professionals.
				</p>

				<div className='mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200 sm:p-7'>
					<p className='text-sm sm:text-base'>
						Sign in to your existing account or create a new one to
						start exploring projects, hiring freelancers and growing
						your professional network.
					</p>
				</div>
			</motion.div>

			{/* Top Glow */}
			<div className='pointer-events-none absolute top-0 left-1/2 h-52 w-[650px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl' />

			{/* Bottom Glow */}
			<div className='pointer-events-none absolute bottom-0 left-1/2 h-52 w-[650px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl' />

			{/* Vignette */}
			<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,.65))]' />
		</main>
	);
}
