'use client'

import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
	const [isFirstVideoPlayed, setIsFirstVideoPlayed] = useState(false)
	const [isSecondVideoPlayed, setIsSecondVideoPlayed] = useState(false)
	const openingVideoRef = useRef<HTMLVideoElement | null>(null)
	const kwenchanaVideoRef = useRef<HTMLVideoElement | null>(null)
	const [isZoomed, setIsZoomed] = useState(false)

	useEffect(() => {
		const video = openingVideoRef.current
		if (!video) return

		const handleTimeUpdate = () => {
			if (!video.duration) return

			const progress = (video.currentTime / video.duration) * 100
			if (progress >= 85 && !isZoomed) {
				setIsZoomed(true)
			}
		}

		video.addEventListener('timeupdate', handleTimeUpdate)

		return () => {
			video.removeEventListener('timeupdate', handleTimeUpdate)
		}
	}, [isZoomed])

	const handlePlayVideo = () => {
		if (openingVideoRef.current) {
			openingVideoRef.current.play()
		}
	}

	const handleSkipScene = () => {
		if (openingVideoRef.current) {
			openingVideoRef.current.currentTime = openingVideoRef.current.duration - 1
			openingVideoRef.current.play()
		}
	}

	const handleFirstVideoEnd = () => {
		setIsFirstVideoPlayed(true)
		if (kwenchanaVideoRef.current) {
			kwenchanaVideoRef.current.play()
			kwenchanaVideoRef.current.volume = 0.5
		}
	}

	const handleSecondVideoEnd = () => {
		setIsSecondVideoPlayed(true)
	}

	// const transition = { duration: 1.5, repeat: 0 }

	return (
		<>
			<div className="relative">
				<motion.div
					initial={{ scale: 0 }}
					animate={isSecondVideoPlayed ? { scale: 1 } : {}}
					transition={{ duration: 1, ease: 'easeInOut' }}
					className={`absolute w-full h-full bg-gray-700 transition-opacity duration-500 ${isSecondVideoPlayed ? 'opacity-100' : 'opacity-0'}`}
					style={{ transformOrigin: 'center' }}
				/>

				{/* Opening Capsule Animation */}
				{!isFirstVideoPlayed && (
					<video
						ref={openingVideoRef}
						src="/opening-capsule-animation.mp4"
						className={`w-full h-full transition-transform duration-1000 scale ${isZoomed ? 'scale-[10]' : 'scale-100'}`}
						onEnded={handleFirstVideoEnd}
					/>
				)}

				{/* Kwenchana Video */}
				<video
					preload="metadata"
					ref={kwenchanaVideoRef}
					src="/kwenchana.mp4"
					className="w-full h-screen"
					hidden={!isFirstVideoPlayed}
					onEnded={handleSecondVideoEnd}
				/>
			</div>
			<div className="w-full flex justify-between">
				<button
					onClick={handlePlayVideo}
					className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
				>
					Open
				</button>
				<button
					onClick={handleSkipScene}
					className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
				>
					Skip Scene
				</button>
			</div>
		</>
	)
}
