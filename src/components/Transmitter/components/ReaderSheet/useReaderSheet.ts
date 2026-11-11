import { useCallback, useEffect, useRef, useState } from 'react';
import { useTransmitterApi } from '../../context';
import { useChannel } from '../Channel/context';
import useChannelActions from '../Channel/useChannelActions';

/** #rs: reading sheet; LÉEMELO reads the bitácora aloud with speechSynthesis. */
const useReaderSheet = () => {
  const api = useTransmitterApi();
  const { sheet, currentDoc, docIndex, pauseMedia } = useChannel();
  const { closeSheets, share } = useChannelActions();
  const [reading, setReading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const open = sheet === 'reader';

  useEffect(() => {
    if (open && bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [open, docIndex]);

  const toggleRead = useCallback(() => {
    if (reading) {
      api.stopSpeak();
      return;
    }
    if (!currentDoc) return;
    pauseMedia();
    api.readAloud(`${currentDoc.heading}. ${currentDoc.paragraphs.join(' ')}`, () => setReading(false));
    if (api.speechSupported) setReading(true);
  }, [api, currentDoc, pauseMedia, reading]);

  const meta = currentDoc ? `${currentDoc.kicker || 'BITÁCORA'} · ${currentDoc.minutes} MIN` : '';
  return {
    open,
    doc: currentDoc,
    meta,
    reading,
    bodyRef,
    toggleRead,
    share: () => currentDoc && share({ id: currentDoc.id, title: currentDoc.heading }),
    close: closeSheets,
  };
};

export default useReaderSheet;
