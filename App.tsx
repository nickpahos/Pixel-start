import { useState, useEffect } from 'react';
import { Responsive, Layout } from 'react-grid-layout';
// @ts-ignore
import { WidthProvider } from 'react-grid-layout';

import { TuiBox } from './components/TuiBox';
import { DateTimeWidget } from './components/DateTimeWidget';
import { StatsWidget } from './components/StatsWidget';
import { WeatherWidget } from './components/WeatherWidget';
import { LinksWidget } from './components/LinksWidget';
import { SearchWidget } from './components/SearchWidget';
import { DonutWidget } from './components/DonutWidget';
import { SnakeWidget } from './components/SnakeWidget';
import { GameOfLifeWidget } from './components/GameOfLifeWidget';
import { MazeWidget } from './components/MazeWidget';
import { Settings } from './components/Settings';
import { ThemeMaker } from './components/ThemeMaker';
import { WidgetPicker } from './components/WidgetPicker';
import { AppProvider, useAppContext } from './contexts/AppContext';

const ResponsiveGridLayout = WidthProvider(Responsive);

function AppContent() {
  const {
    isThemeMakerOpen, setIsThemeMakerOpen,
    linkGroups,
    statsMode,

    layouts, setLayouts,
    tempUnit,
    openInNewTab,
    showWidgetTitles,
    reserveSettingsSpace,
    customFont,
    funOptions,
    activeWidgets,
    isLayoutLocked,
    isResizingEnabled,
    handleSaveCustomTheme,
    removeExtraWidget,
    toggleWidget,
    isCrt
  } = useAppContext();

  const onLayoutChange = (_: Layout[], allLayouts: any) => {
    setLayouts(allLayouts);
  };

  const showHandles = isResizingEnabled && !isLayoutLocked;

  const appStyle = {
    fontFamily: customFont ? customFont : '"JetBrains Mono", monospace'
  };

  const [gridReady, setGridReady] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // briefly hide grid items while layout is computed, then suppress transitions
  useEffect(() => {
    const showTimer = setTimeout(() => setGridReady(true), 150);
    const animTimer = setTimeout(() => setIsFirstLoad(false), 3000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(animTimer);
    };
  }, []);

  return (
    <div
      className={`min-h-screen w-full px-2 pb-2 pt-6 text-sm bg-[var(--color-bg)] relative overflow-hidden select-none ${isCrt ? 'theme-crt' : ''}`}
      style={appStyle}
    >

      {isCrt && (
        <>
          <div className="crt-curve-container"></div>
          <div className="crt-scanlines"></div>
          <div className="crt-noise"></div>
          <div className="crt-flicker"></div>
        </>
      )}

      <Settings />
      <WidgetPicker />

      {isThemeMakerOpen && (
        <ThemeMaker
          onSave={handleSaveCustomTheme}
          onClose={() => setIsThemeMakerOpen(false)}
        />
      )}

      <div className="w-full z-10 relative px-2">
        <ResponsiveGridLayout
          className={`layout ${showHandles ? '' : 'hide-handles'} ${!gridReady ? 'grid-hidden' : ''} ${isFirstLoad ? 'no-animate' : ''}`}
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          onLayoutChange={onLayoutChange}
          draggableHandle=".drag-handle"
          margin={[10, 10]}
          isResizable={showHandles}
          isDraggable={!isLayoutLocked}
          useCSSTransforms={true}
          resizeHandles={['se', 'sw', 'ne', 'nw']}
        >
          {reserveSettingsSpace && (
            <div key="settings-guard" className="settings-guard-item pointer-events-none" />
          )}

          {Object.keys(activeWidgets).map(key => {
            if (!activeWidgets[key]) return null;
            const isExtra = key.includes('-');
            const type = isExtra ? key.split('-')[0] : key;

            // Common props
            const boxProps = {
                key: key,
                title: isExtra ? `${type}.exe (${key.split('-')[1].slice(-4)})` : (
                    ['snake', 'life', 'fireworks', 'starfield', 'rain', 'maze', 'pipes', 'matrix', 'donut'].includes(type)
                        ? (type === 'life' ? 'conway.life' :
                           type === 'donut' ? 'donut.c' :
                           type === 'pipes' ? 'pipes.scr' :
                           type === 'matrix' ? 'matrix' :
                           type === 'snake' ? 'snake.exe' :
                           type === 'fireworks' ? 'fireworks.py' :
                           type === 'starfield' ? 'starfield.scr' :
                           type === 'rain' ? 'rain.sh' :
                           type === 'maze' ? 'maze.gen' : type)
                        : (type === 'todo' ? 'todo-list' : type === 'search' ? 'web_search' : type)
                ),
                showTitle: showWidgetTitles,
                onClose: !isLayoutLocked
                    ? (isExtra ? () => removeExtraWidget(key) : () => toggleWidget(key))
                    : undefined
            };

            switch (type) {
                case 'search':
                    return <TuiBox {...boxProps} title="web_search"><SearchWidget /></TuiBox>;
                case 'datetime':
                    return <TuiBox {...boxProps} title="datetime"><DateTimeWidget /></TuiBox>;
                case 'stats':
                    return <TuiBox {...boxProps} title="stats"><StatsWidget mode={statsMode} /></TuiBox>;
                case 'weather':
                    return <TuiBox {...boxProps} title="weather"><WeatherWidget unit={tempUnit} /></TuiBox>;
                case 'links':
                    return <TuiBox {...boxProps} title="links"><LinksWidget groups={linkGroups} openInNewTab={openInNewTab} /></TuiBox>;
                case 'donut':
                    return <TuiBox {...boxProps}><DonutWidget speed={funOptions.donut.speed} /></TuiBox>;
                case 'snake':
                    return <TuiBox {...boxProps}><SnakeWidget speed={funOptions.snake.speed} /></TuiBox>;
                case 'life':
                    return <TuiBox {...boxProps}><GameOfLifeWidget speed={funOptions.life.speed} /></TuiBox>;
                case 'maze':
                    return <TuiBox {...boxProps}><MazeWidget speed={funOptions.maze.speed} /></TuiBox>;
                default:
                    return null;
            }
          })}

        </ResponsiveGridLayout>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
