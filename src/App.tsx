import React, { useEffect, useState } from 'react';
import {LightSpeed} from './LightSpeed'
import { VideoPlayer } from './VideoPlayer';

const lightSpeed = new LightSpeed('SED_WEBSOCKET_URL')


function App() {
  const [stream, setStream] = useState<MediaStream>(new MediaStream())
  useEffect(() => {
    lightSpeed.on('newStream', (newStream: MediaStream) => {
      setStream(newStream)
    })
  }, [])
  return (
    <div>
      <VideoPlayer mediaStream={stream} />
    </div>
  );
}

export default App;
