import React from 'react';
import { WeatherIcon } from './WeatherIcons';
import { convertTemp, TempUnit } from '../utils/weatherUtils';
import { useWeather } from '../hooks/useWeather';

interface WeatherWidgetProps {
  unit?: TempUnit;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ unit = 'C' }) => {
  const { data, loading, error, refetch } = useWeather();

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-[var(--color-muted)] select-none">
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-[var(--color-muted)] rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-[var(--color-muted)] rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-[var(--color-muted)] rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="text-xs font-mono opacity-50">loading..</span>
      </div>
    );
  }

  if (error || !data) {
    const isTimeout = error?.toLowerCase().includes("timed out");
    const isPermission = error?.toLowerCase().includes("denied") || error?.toLowerCase().includes("permission");
    let errorText = error || 'no data';
    if (isTimeout) errorText = "Request Timed Out";

    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-[var(--color-muted)] select-none px-4">
        <span className="text-sm font-mono text-[var(--color-accent)]">⚠</span>
        <span className="text-xs font-mono opacity-70 text-center">{errorText}</span>
        {isPermission && (
          <span className="text-[10px] font-mono opacity-40">check location permissions</span>
        )}
        <button
          onClick={refetch}
          className="text-[10px] border border-[var(--color-border)] px-2 py-1 rounded hover:bg-[var(--color-bg-secondary)] transition-colors opacity-60 hover:opacity-100 mt-2"
        >
          retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col select-none overflow-hidden bg-[var(--color-bg)]">

      {/* ── Today section ── */}
      <div className="flex-shrink-0 flex flex-col px-4 pt-4 pb-3">

        {/* Location */}
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted)] opacity-70 mb-2 truncate">
          {data.locationName}
        </span>

        {/* Icon + Temp row */}
        <div className="flex items-center gap-4">
          {/* Big weather icon */}
          <div className="text-[var(--color-accent)] flex-shrink-0" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1 }}>
            <i className={`wi ${getIconClass(data.current.weatherCode, data.current.isDay === 1)}`} />
          </div>

          {/* Temp + condition */}
          <div className="flex flex-col min-w-0">
            <span className="text-[var(--color-fg)] font-bold leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              {convertTemp(data.current.temp, unit)}°{unit}
            </span>
            <span className="text-[var(--color-muted)] text-sm capitalize truncate mt-0.5">
              {data.current.condition}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-3 font-mono text-xs text-[var(--color-muted)]">
          <span>
            <span className="opacity-60">feels </span>
            <span className="text-[var(--color-fg)]">{convertTemp(data.current.feelsLike, unit)}°</span>
          </span>
          <span>
            <span className="opacity-60">hum </span>
            <span className="text-[var(--color-fg)]">{data.current.humidity}%</span>
          </span>
          <span>
            <span className="opacity-60">wind </span>
            <span className="text-[var(--color-fg)]">{data.current.windSpeed} mph</span>
          </span>
          <span>
            <span className="opacity-60">precip </span>
            <span className="text-[var(--color-fg)]">{data.current.precipProb}%</span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-[var(--color-border)] opacity-30 flex-shrink-0" />

      {/* ── 7-day forecast ── */}
      {data.dailyForecast && data.dailyForecast.length > 0 && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-2 py-2">
          <div className="flex h-full gap-1 min-w-0">
            {data.dailyForecast.map((day, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-between flex-1 min-w-[2.5rem] px-1 py-1.5 rounded font-mono"
                style={{ background: i === 0 ? 'var(--color-bg-secondary, rgba(255,255,255,0.04))' : undefined }}
              >
                {/* Day label */}
                <span className={`text-[10px] uppercase tracking-widest ${i === 0 ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)] opacity-70'}`}>
                  {day.date}
                </span>

                {/* Icon */}
                <div className="text-[var(--color-accent)] my-1" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', lineHeight: 1 }}>
                  <i className={`wi ${getIconClass(day.weatherCode, true)}`} />
                </div>

                {/* High */}
                <span className="text-[var(--color-fg)] text-[11px] font-bold tabular-nums">
                  {convertTemp(day.tempMax, unit)}°
                </span>
                {/* Low */}
                <span className="text-[var(--color-muted)] text-[10px] tabular-nums opacity-60">
                  {convertTemp(day.tempMin, unit)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Inline icon class helper (same mapping as WeatherIcons.tsx)
function getIconClass(code: number, isDay: boolean): string {
  switch (code) {
    case 0: return isDay ? 'wi-day-sunny' : 'wi-night-clear';
    case 1: return isDay ? 'wi-day-sunny-overcast' : 'wi-night-alt-partly-cloudy';
    case 2: return isDay ? 'wi-day-cloudy' : 'wi-night-alt-cloudy';
    case 3: return 'wi-cloudy';
    case 45:
    case 48: return isDay ? 'wi-day-fog' : 'wi-night-fog';
    case 51:
    case 53:
    case 55: return isDay ? 'wi-day-sprinkle' : 'wi-night-alt-sprinkle';
    case 56:
    case 57: return isDay ? 'wi-day-sleet' : 'wi-night-alt-sleet';
    case 61: return isDay ? 'wi-day-showers' : 'wi-night-alt-showers';
    case 63:
    case 65: return isDay ? 'wi-day-rain' : 'wi-night-alt-rain';
    case 66:
    case 67: return isDay ? 'wi-day-rain-mix' : 'wi-night-alt-rain-mix';
    case 71:
    case 73:
    case 75: return isDay ? 'wi-day-snow' : 'wi-night-alt-snow';
    case 77: return isDay ? 'wi-day-hail' : 'wi-night-alt-hail';
    case 80:
    case 81:
    case 82: return isDay ? 'wi-day-showers' : 'wi-night-alt-showers';
    case 85:
    case 86: return isDay ? 'wi-day-snow' : 'wi-night-alt-snow';
    case 95: return isDay ? 'wi-day-thunderstorm' : 'wi-night-alt-thunderstorm';
    case 96:
    case 99: return isDay ? 'wi-day-storm-showers' : 'wi-night-alt-storm-showers';
    default: return 'wi-na';
  }
}
