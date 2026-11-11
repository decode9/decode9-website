import { CONTACT_INDEX, D9_INDEX } from '@/data/profile/stations';

/** Flags of each station button (decode9 in red tag, contact with the "?"). */
const useStationDial = () => ({
  isD9: (i: number) => i === D9_INDEX,
  isContact: (i: number) => i === CONTACT_INDEX,
});

export default useStationDial;
