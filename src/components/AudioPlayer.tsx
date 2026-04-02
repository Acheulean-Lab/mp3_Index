'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePlausible } from 'next-plausible';
import objects from '@/data/index.json';

interface AudioPlayerProps {
    objectId: string;
    isOpen?: boolean;
}

export default function AudioPlayer({ objectId, isOpen }: AudioPlayerProps) {
    const [streamUrl, setStreamUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [errorMSG, setErrorMSG] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [playButtonHover, setPlayButtonHover] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const hasAutoplayed = useRef(false);
    const plausible = usePlausible();
    const trackedProgress = useRef<Set<number>>(new Set());

    const trackPercent = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;

    const playIcon = (
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden focusable="false">
            <path fill="currentColor" d="M8 5v14l11-7z" />
        </svg>
    );
    const pauseIcon = (
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden focusable="false">
            <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
    );

    const handleSeek = (clientX: number) => {
        if (!progressRef.current || !audioRef.current) return;
        const rect = progressRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        const newTime = percent * duration;
        audioRef.current.currentTime = newTime;
        setProgress(newTime);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleSeek(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            handleSeek(e.clientX);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (playing) {
                audioRef.current.pause();
                setPlaying(false);
            } else {
                audioRef.current.play();
                setPlaying(true);
                plausible('audio_play', { props: { objectId } });
            }
        }
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    useEffect(() => {
        const obj = objects.find((o) => o.id === objectId);
        if (obj) {
            setStreamUrl(`/audio/${obj.filename}`);
            setErrorMSG('');
        } else {
            setStreamUrl(null);
            setErrorMSG('Audio not found.');
        }
    }, [objectId]);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isOpen && streamUrl) {
            audioRef.current.play().then(() => {
                hasAutoplayed.current = true;
                setPlaying(true);
                plausible('audio_play', { props: { objectId } });
            }).catch(() => {
                hasAutoplayed.current = false;
            });
        } else {
            audioRef.current.pause();
            setPlaying(false);
            if (!isOpen) {
                setProgress(0);
                hasAutoplayed.current = false;
            }
        }
    }, [isOpen, streamUrl, objectId, plausible]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            setProgress(current);
            if (duration > 0 && current / duration >= 0.5 && !trackedProgress.current.has(50)) {
                trackedProgress.current.add(50);
                plausible('audio_progress', { props: { objectId, percent: 50 } });
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    };

    const handleEnded = () => {
        setProgress(0);
        setPlaying(false);
        plausible('audio_complete', { props: { objectId } });
    };

    if (errorMSG) return (
        <div style={{ color: '#E53935', fontSize: '0.8rem' }}>{errorMSG}</div>
    );

    return (
        <div style={{ width: '100%', padding: '0px 10px 24px', boxSizing: 'border-box', background: 'black' }}>
            {streamUrl && (
                <audio
                    ref={audioRef}
                    src={streamUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                    hidden
                />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0px 16px 0px 16px', height: '2px' }}>
                <div
                    ref={progressRef}
                    style={{
                        flex: 1,
                        height: '1px',
                        background: 'rgb(255, 255, 255)',
                        borderRadius: '0px',
                        position: 'relative',
                        cursor: 'pointer',
                    }}
                    onMouseDown={handleMouseDown}
                >
                    <div style={{
                        width: `${trackPercent}%`,
                        height: '1px',
                        background: '#FF007B',
                        borderRadius: '0px',
                        position: 'absolute',
                        left: 0,
                        bottom: '-0px',
                        transition: isDragging ? 'none' : 'width 0.1s linear',
                    }} />
                    <div style={{
                        width: '9px',
                        height: '9px',
                        background: '#FF007B',
                        position: 'absolute',
                        left: `${trackPercent}%`,
                        top: '-4px',
                        transform: 'translateX(-4px)',
                    }} />
                </div>
                <button
                    type="button"
                    onClick={togglePlay}
                    title={playing ? 'Pause' : 'Play'}
                    aria-label={playing ? 'Pause audio' : 'Play audio'}
                    onMouseEnter={() => setPlayButtonHover(true)}
                    onMouseLeave={() => setPlayButtonHover(false)}
                    style={{
                        width: 24,
                        height: 24,
                        flexShrink: 0,
                        border: 'none',
                        borderRadius: '50%',
                        backgroundColor: playButtonHover ? '#FFFFFF' : '#FF007B',
                        color: '#000000',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                    }}
                >
                    {playing ? pauseIcon : playIcon}
                </button>
            </div>
        </div>
    );
}
