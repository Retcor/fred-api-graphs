import { LinearProgress } from '@mui/material';

const Loading = ({ percentage, label }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '4px' }}>
      <LinearProgress
        variant="determinate"
        value={percentage}
        style={{ width: '100%', position: 'absolute', bottom: '0' }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <span style={{ backgroundColor: '#fff', padding: '2px 4px' }}>
          {`${label}%`}
        </span>
      </div>
    </div>
  );
};

export default Loading;