'use client';

import React, { useState, useEffect } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import objects from '@/data/index.json';

interface GalleryObject {
  id: string;
  title: string;
  description: string;
  filename: string;
}

export default function Home() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bgTransition, setBgTransition] = useState('background 0.2s');
  const prevExpandedId = React.useRef<string | null>(null);

  useEffect(() => {
    // Detect collapse: transitioning FROM an open state TO null
    if (prevExpandedId.current !== null && expandedId === null) {
      setBgTransition('none');
      setTimeout(() => setBgTransition('background 0.2s'), 10);
    } else {
      setBgTransition('background 0.2s');
    }
    prevExpandedId.current = expandedId;
  }, [expandedId]);

  const handleItemClick = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <main style={{
      margin: 0,
      minHeight: '100vh',
      fontFamily: 'Universe, sans-serif',
      background: '#dbe4eb',
      color: 'black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '40px 0',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        maxWidth: '900px',
        counterReset: 'item-counter',
      }}>
        <hr style={{ border: 'none', borderTop: '1px solid rgb(0, 0, 0)', margin: 0, width: '100%' }} />

        <div style={{ paddingTop: '6px', paddingLeft: '112px', paddingBottom: '96px', fontSize: '18px', color: 'black' }}>
          Index
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgb(0, 0, 0)', margin: 0, width: '100%' }} />

        {objects.map((obj, index) => {
          const isOpen = expandedId === obj.id;
          return (
            <React.Fragment key={obj.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleItemClick(obj.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(obj.id); }}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '12px 24px 12px 4px',
                  cursor: 'pointer',
                  transition: bgTransition === 'none' ? 'none' : `${bgTransition}, color 0.2s`,
                  background: isOpen ? 'black' : 'transparent',
                  color: isOpen ? 'white' : 'black',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (!isOpen) {
                    el.style.background = 'rgb(0,0,0)';
                    el.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (!isOpen) {
                    el.style.background = 'transparent';
                    el.style.color = 'black';
                  }
                }}
              >
                <span style={{
                  fontSize: '18px',
                  marginRight: '20px',
                  color: 'inherit',
                  fontWeight: 400,                  width: '40px',
                  textAlign: 'right',
                  display: 'inline-block',                }}>
                  {index + 1}
                </span>
                <button style={{
                  paddingLeft: '48px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  color: 'inherit',
                  textAlign: 'left',
                  flex: 1,
                  width: '100%',
                }}>
                  {obj.title}
                </button>
              </div>

              {isOpen && (
                <div style={{
                  background: 'black',
                  borderRadius: '8px',
                }}>
                  <AudioPlayer objectId={obj.id} isOpen={isOpen} />
                </div>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid rgb(0, 0, 0)', margin: 0, width: '100%' }} />
            </React.Fragment>
          );
        })}
      </div>
    </main>
  );
}
