import { createContext, useContext } from 'react';
import type { TransmitterApi } from './interface';

/** Transmitter API for the screens, panes and sheets (provided by <Transmitter />). */
export const TransmitterApiContext = createContext<TransmitterApi | null>(null);

/** Reads the transmitter API. Throws outside <Transmitter /> (programming error). */
export const useTransmitterApi = (): TransmitterApi => {
  const api = useContext(TransmitterApiContext);
  if (!api) throw new Error('useTransmitterApi must be used inside <Transmitter />');
  return api;
};
