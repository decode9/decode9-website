import { useEffect } from 'react';
import { useTransmitterApi } from '../../context';
import { useChannel } from '../Channel/context';
import useChannelActions from '../Channel/useChannelActions';

/**
 * Glue between the transmitter and the channel (renders nothing):
 * media playing → TRANSMITIENDO; station change / ✕ / hidden tab → close sheets and pause.
 */
const ChannelBridge = () => {
  const api = useTransmitterApi();
  const { videoClock, audioClock, pauseMedia } = useChannel();
  const { closeSheets, closeFullscreen } = useChannelActions();
  const mediaOn = videoClock.playing || audioClock.playing;

  useEffect(() => {
    api.setMediaOn(mediaOn);
  }, [api, mediaOn]);

  useEffect(() => {
    const offStation = api.on('station', () => {
      pauseMedia();
      closeSheets();
    });
    const offExit = api.on('exit', () => {
      pauseMedia();
      closeFullscreen();
      closeSheets();
    });
    const offHidden = api.on('hidden', () => pauseMedia());
    return () => {
      offStation();
      offExit();
      offHidden();
    };
  }, [api, pauseMedia, closeSheets, closeFullscreen]);

  return null;
};

export default ChannelBridge;
