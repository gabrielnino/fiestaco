import { COLORS } from "../lib/constants";

export default function LoadingSkeleton() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
    }}>
      {/* Header skeleton */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px',
      }}>
        <div style={{
          width: '120px',
          height: '40px',
          background: COLORS.darkCard,
          borderRadius: '8px',
          animation: 'pulse 1.5s infinite',
        }} />
        <div style={{
          display: 'flex',
          gap: '12px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: COLORS.darkCard,
            borderRadius: '50%',
            animation: 'pulse 1.5s infinite',
          }} />
          <div style={{
            width: '40px',
            height: '40px',
            background: COLORS.darkCard,
            borderRadius: '50%',
            animation: 'pulse 1.5s infinite',
          }} />
        </div>
      </div>

      {/* Hero skeleton */}
      <div style={{
        height: '300px',
        background: COLORS.darkCard,
        borderRadius: '16px',
        marginBottom: '40px',
        animation: 'pulse 1.5s infinite',
      }} />

      {/* Configurator skeleton */}
      <div style={{
        background: COLORS.darkCard,
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px',
        animation: 'pulse 1.5s infinite',
      }}>
        <div style={{
          width: '200px',
          height: '30px',
          background: '#2A2A2A',
          borderRadius: '6px',
          marginBottom: '20px',
          animation: 'pulse 1.5s infinite',
        }} />
        
        {/* Flavors grid skeleton */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '16px',
          marginBottom: '30px',
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{
              height: '140px',
              background: '#2A2A2A',
              borderRadius: '12px',
              animation: 'pulse 1.5s infinite',
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
        </div>

        {/* Addons skeleton */}
        <div style={{
          width: '150px',
          height: '25px',
          background: '#2A2A2A',
          borderRadius: '6px',
          marginBottom: '20px',
          animation: 'pulse 1.5s infinite',
        }} />
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              height: '60px',
              background: '#2A2A2A',
              borderRadius: '8px',
              animation: 'pulse 1.5s infinite',
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        background: COLORS.darkCard,
        borderRadius: '12px',
        animation: 'pulse 1.5s infinite',
      }}>
        <div style={{
          width: '150px',
          height: '20px',
          background: '#2A2A2A',
          borderRadius: '4px',
          animation: 'pulse 1.5s infinite',
        }} />
        <div style={{
          width: '100px',
          height: '40px',
          background: '#2A2A2A',
          borderRadius: '20px',
          animation: 'pulse 1.5s infinite',
        }} />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}