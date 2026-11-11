import { MENU } from '@/data/terminal';
import { cn } from '@/utils/cn';
import { SCREENS } from '../../screens/registry';
import ContextMenu from './components/ContextMenu';
import Desk from './components/Desk';
import Dock from './components/Dock';
import ScreenTabs from './components/ScreenTabs';
import type { StageProps } from './interface';
import useStage from './useStage';
import styles from './styles.module.scss';

/** Screen area (original main.stage > section.scr): optional head and tabs, the window desk and the dock. */
const Stage = ({ stageRef, deskRef, wm, screen, screenVersion, leaving, tab, selectTab, lang, reduceMotion, style }: StageProps) => {
  const { entering, menu, onContextMenu, onMenuAction } = useStage({ stageRef, wm, screenVersion, lang });
  const def = SCREENS[screen];
  const item = MENU.find((m) => m.id === screen) ?? MENU[0];

  return (
    <main ref={stageRef} className={styles.stage} data-stage style={style} onContextMenu={onContextMenu}>
      <section
        className={cn(styles.scr, entering && !leaving && styles.in, leaving && styles.out)}
        aria-label={item.t[lang === 'en' ? 1 : 0]}
      >
        {def.head}
        {def.tabs && (
          <ScreenTabs tabs={def.tabs} selected={tab} onSelect={selectTab} screenVersion={screenVersion} reduceMotion={reduceMotion} />
        )}
        <Desk deskRef={deskRef} wm={wm} lang={lang} reduceMotion={reduceMotion} />
        <Dock closed={wm.closed} onRestore={wm.restore} />
      </section>
      {menu && (
        <ContextMenu
          target={menu.target}
          title={menu.title}
          windowItems={menu.windowItems}
          deskItems={menu.deskItems}
          closeAllItem={menu.closeAllItem}
          visible={menu.visible}
          lang={lang}
          onAction={onMenuAction}
        />
      )}
    </main>
  );
};

export default Stage;
