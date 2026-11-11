import { createContext, useContext } from 'react';
import type { ChannelState } from './interface';

export const ChannelContext = createContext<ChannelState | null>(null);

/** Channel state (videos, audios, readings, sheets). Throws outside <ChannelProvider />. */
export const useChannel = (): ChannelState => {
  const state = useContext(ChannelContext);
  if (!state) throw new Error('useChannel must be used inside <ChannelProvider />');
  return state;
};
