'use client';

import { useEffect, useRef, useState } from 'react';
import { POST_TABS, POSTS_PER_PAGE } from '@/data/terminal/channel';
import type { Post } from '@/interfaces/post';
import { decodeText } from '@/utils/decodeText';
import { filterPosts, paginate, sortPosts } from '../../postFeed';
import type { PostListProps } from './interface';

/** Canal list state (original PS + loadPosts + ACT.ptab/ppage/post). */
const usePostList = ({ source, onPick, auto, reduceMotion }: PostListProps) => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const changed = useRef(false);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  useEffect(() => {
    let alive = true;
    let timer = 0;
    source
      .list()
      .catch(() => [])
      .then((raw) => {
        if (!alive) return;
        const list = sortPosts(raw);
        setPosts(list);
        if (auto && list.length) {
          timer = window.setTimeout(() => {
            auto.done();
            setSelected(0);
            onPickRef.current(list, 0, true);
          }, auto.delay);
        }
      });
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
    // Loads once per window mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Tab or page change re-decodes the grid (original decodeText(.pgrid, 450)). */
  useEffect(() => {
    if (!changed.current) return undefined;
    return decodeText(gridRef.current, 450, { reduceMotion });
  }, [tab, page, reduceMotion]);

  const filtered = posts ? filterPosts(posts, POST_TABS[tab].key) : [];
  const view = paginate(filtered, page, POSTS_PER_PAGE);

  const selectTab = (i: number) => {
    changed.current = true;
    setTab(i);
    setPage(0);
  };
  const goPage = (i: number) => {
    changed.current = true;
    setPage(Math.max(0, i));
  };
  const pick = (index: number) => {
    if (!posts) return;
    setSelected(index);
    onPickRef.current(posts, index);
  };

  return { loaded: posts !== null, tab, view, total: filtered.length, selected, gridRef, selectTab, goPage, pick };
};

export default usePostList;
