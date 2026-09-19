import { useState, useEffect } from 'react';
import { SECTORS, jumpToSector, resetCameraView, SPATIAL_EVENTS } from '../utils/spatialWorldManager';
import { Compass, RotateCcw, Radio, Sparkles, Activity } from 'lucide-react';

/**
 * SpatialFlightDeck: Futuristic Tactical HUD & Sector Navigation Console
 * 
 * Provides a sci-fi cockpit telemetry HUD that directly interfaces with the
 * full-page 3D WebGL Megastructure in real-time.
 */
export default function SpatialFlightDeck() {
  const [telemetry, setTelemetry] = useState({
    camX: '0.0',
    camY: '2.0',
    camZ: '28.0',
    sector: 'CORE NEXUS // SINGULARITY',
    sectorId: 0,
    progress: '0'
  });

  const [hoveredWaypoint, setHoveredWaypoint] = useState(null);
  const [isCalibrating, setIsCalibrating] = useState(false);

  useEffect(() => {
    const handleTelemetry = (e) => {
      if (e.detail) {
        setTelemetry(e.detail);
      }
    };

    const handleWaypointHover = (e) => {
      setHoveredWaypoint(e.detail);
    };

    window.addEventListener(SPATIAL_EVENTS.TELEMETRY_UPDATE, handleTelemetry);
    window.addEventListener(SPATIAL_EVENTS.WAYPOINT_HOVER, handleWaypointHover);

    return () => {
      window.removeEventListener(SPATIAL_EVENTS.TELEMETRY_UPDATE, handleTelemetry);
      window.removeEventListener(SPATIAL_EVENTS.WAYPOINT_HOVER, handleWaypointHover);
    };
  }, []);

  const handleReset = () => {
    setIsCalibrating(true);
    resetCameraView();
    jumpToSector(0);
    setTimeout(() => setIsCalibrating(false), 800);
  };

  const activeSectorData = SECTORS[telemetry.sectorId] || SECTORS[0];

  return (
    <div
      className="hud-panel"
      style={{
        borderRadius: '20px',
        padding: '1.6rem',
        position: 'relative',
        color: 'var(--text-main)',
        minHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}
    >
      {/* Corner Cyber Tactical Accents */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '12px',
          height: '12px',
          borderTop: '2px solid var(--accent-color)',
          borderLeft: '2px solid var(--accent-color)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '12px',
          height: '12px',
          borderTop: '2px solid var(--accent-color)',
          borderRight: '2px solid var(--accent-color)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: '12px',
          height: '12px',
          borderBottom: '2px solid var(--accent-color)',
          borderLeft: '2px solid var(--accent-color)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '12px',
          height: '12px',
          borderBottom: '2px solid var(--accent-color)',
          borderRight: '2px solid var(--accent-color)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Telemetry Header */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '0.85rem',
            marginBottom: '1.2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isCalibrating ? '#f59e0b' : 'var(--accent-color)',
                boxShadow: isCalibrating ? '0 0 10px #f59e0b' : '0 0 10px var(--accent-color)',
                animation: 'pulse 1.8s infinite'
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)'
              }}
            >
              SPATIAL FLIGHT DECK v3.0
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <Activity size={12} color="var(--accent-color)" />
            <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>60 FPS // BUFFER ACTIVE</span>
          </div>
        </div>

        {/* Live Active Sector Hero Callout */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid var(--border-card-hover)',
            borderRadius: '14px',
            padding: '1rem 1.2rem',
            marginBottom: '1.2rem',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '0.4rem'
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.14em',
                  color: 'var(--accent-color)',
                  textTransform: 'uppercase',
                  fontWeight: 700
                }}
              >
                {activeSectorData.code} • SECTOR LOCK
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginTop: '2px',
                  color: '#ffffff'
                }}
              >
                {activeSectorData.title}
              </h3>
            </div>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--accent-color)',
                border: '1px solid var(--accent-color)',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(0, 242, 254, 0.08)'
              }}
            >
              {activeSectorData.status}
            </span>
          </div>

          <p
            style={{
              fontSize: '0.83rem',
              color: 'var(--text-muted)',
              lineHeight: 1.45,
              marginBottom: '0.85rem'
            }}
          >
            {activeSectorData.description}
          </p>

          {/* Coordinate Telemetry Vector Display */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem'
            }}
          >
            <div>
              <span style={{ color: 'var(--text-dim)' }}>CAM_X: </span>
              <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>{telemetry.camX}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>CAM_Y: </span>
              <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>{telemetry.camY}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>CAM_Z: </span>
              <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>{telemetry.camZ}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Interactive: Sector Jump Trajectory Matrix */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.6rem'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.1em'
            }}
          >
            WARP TRAJECTORY MATRIX
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--accent-color)'
            }}
          >
            WARP PROGRESS: {telemetry.progress}%
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '0.85rem'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${telemetry.progress}%`,
              background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-color))',
              transition: 'width 0.15s linear'
            }}
          />
        </div>

        {/* Sector Waypoint Selector Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.35rem',
            marginBottom: '1rem'
          }}
        >
          {SECTORS.map((sec) => {
            const isSelected = telemetry.sectorId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => jumpToSector(sec.id)}
                title={sec.name}
                style={{
                  background: isSelected
                    ? 'var(--accent-soft)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected
                    ? '1px solid var(--accent-color)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: isSelected ? 'var(--accent-color)' : 'var(--text-muted)'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    fontWeight: isSelected ? 700 : 500
                  }}
                >
                  {sec.code}
                </span>
                <span
                  style={{
                    fontSize: '0.58rem',
                    color: isSelected ? '#ffffff' : 'var(--text-dim)',
                    marginTop: '2px',
                    textTransform: 'uppercase'
                  }}
                >
                  {sec.key}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Raycast / Waypoint Hover Notification */}
      {hoveredWaypoint ? (
        <div
          style={{
            background: 'rgba(0, 242, 254, 0.12)',
            border: '1px dashed var(--accent-color)',
            borderRadius: '10px',
            padding: '0.65rem 0.85rem',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <Sparkles size={14} color="var(--accent-color)" />
          <div style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>BEACON TARGET: </span>
            <span style={{ color: '#ffffff' }}>{hoveredWaypoint.name}</span>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px dashed rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '0.65rem 0.85rem',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={14} color="var(--text-dim)" />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                color: 'var(--text-dim)'
              }}
            >
              DRAG VIEW TO ROTATE // SCROLL TO WARP
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--accent-color)'
            }}
          >
            360° ORBIT
          </span>
        </div>
      )}

      {/* Bottom Command Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.85rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <button
          onClick={handleReset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            padding: '0.4rem 0.8rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-color)';
            e.currentTarget.style.color = 'var(--accent-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <RotateCcw size={12} />
          <span>RESET VECTOR</span>
        </button>

        <a
          href="#about"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'var(--accent-soft)',
            border: '1px solid var(--border-card-hover)',
            borderRadius: '8px',
            padding: '0.4rem 0.85rem',
            color: 'var(--accent-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            textDecoration: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Compass size={12} />
          <span>INITIALIZE DESCENT</span>
        </a>
      </div>
    </div>
  );
}
