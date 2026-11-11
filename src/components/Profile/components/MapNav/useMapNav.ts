import { D9_INDEX } from '@/data/profile/stations';

/** The last entry (decode9) is drawn dashed and red. */
const useMapNav = () => ({ isD9: (i: number) => i === D9_INDEX });

export default useMapNav;
