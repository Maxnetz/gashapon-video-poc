'use client'

import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
	const [isFirstVideoPlayed, setIsFirstVideoPlayed] = useState(false)
	const [isSecondVideoPlayed, setIsSecondVideoPlayed] = useState(false)
	const openingVideoRef = useRef<HTMLVideoElement | null>(null)
	const kwenchanaVideoRef = useRef<HTMLVideoElement | null>(null)
	const [isZoomed, setIsZoomed] = useState(false)
	const [isSkipButtonClicked, setIsSkipButtonClicked] = useState(false)

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
		if (kwenchanaVideoRef.current) {
			kwenchanaVideoRef.current.currentTime = kwenchanaVideoRef.current.duration - 1
			kwenchanaVideoRef.current.play()
		}

		setIsSkipButtonClicked(true)
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
			<div className="w-full flex justify-between">
				<button
					onClick={handlePlayVideo}
					className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
				>
					Play
				</button>
				{kwenchanaVideoRef.current && !isSkipButtonClicked ? (
					<button
						onClick={handleSkipScene}
						className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
					>
						Skip Scene
					</button>
				) : null}
			</div>
			<div className="relative">
				<motion.div
					initial={{ scale: 0, opacity: 0 }}
					animate={isSecondVideoPlayed ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
					transition={{ duration: 1, ease: 'easeInOut' }}
					className="absolute w-full h-full bg-gray-700"
					style={{ transformOrigin: 'center' }}
				>
					content
				</motion.div>

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
					preload="auto"
					ref={kwenchanaVideoRef}
					src="/kwenchana.MP4"
					className="w-full h-screen"
					hidden={!isFirstVideoPlayed}
					onEnded={handleSecondVideoEnd}
				/>
			</div>
		</>
	)
}
