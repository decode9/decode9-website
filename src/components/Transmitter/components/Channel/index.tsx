import { ChannelContext } from './context';
import useChannelState from './useChannelState';
import type { ChannelProviderProps } from './interface';

/** Holds the channel state shared by the panes, the sheets and the fullscreen player. */
const ChannelProvider = ({ deps, children }: ChannelProviderProps) => {
  const state = useChannelState(deps);
  return <ChannelContext.Provider value={state}>{children}</ChannelContext.Provider>;
};

export default ChannelProvider;
