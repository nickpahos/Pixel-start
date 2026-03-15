import React, { useState } from 'react';
import { convertTemp, TempUnit, getWeatherCondition } from '../utils/weatherUtils';
import { useWeather } from '../hooks/useWeather';

interface WeatherWidgetProps {
  unit?: TempUnit;
}

const RainBars: React.FC<{ hourlyPrecip: number[] }> = ({ hourlyPrecip }) => {
  const bars = Array.from({ length: 12 }, (_, i) => hourlyPrecip[i * 2] ?? 0);
  const maxVal = Math.max(...bars, 1);
  return (
    <div className="flex items-end gap-px h-full w-full">
      {bars.map((val, i) => (
        <div
          key={i}
          className="flex-1 bg-[var(--color-accent)] opacity-60 rounded-sm transition-all duration-300"
          style={{ height: `${Math.max(3, (val / maxVal) * 100)}%` }}
        />
      ))}
    </div>
  );
};

function pollenLabel(val: number): string {
  if (val < 10) return 'low';
  if (val < 50) return 'mod';
  if (val < 100) return 'high';
  return 'v.high';
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ unit = 'C' }) => {
  const { data, loading, error, refetch } = useWeather();
  const [selectedDay, setSelectedDay] = useState(0);

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

  const day = data.dailyForecast[selectedDay];
  const isToday = selectedDay === 0;

  const displayTemp = isToday
    ? convertTemp(data.current.temp, unit)
    : convertTemp(day.tempMax, unit);

  const displayCondition = isToday
    ? data.current.condition
    : getWeatherCondition(day.weatherCode, 1);

  const displayWeatherCode = isToday ? data.current.weatherCode : day.weatherCode;
  const displayIsDay = isToday ? data.current.isDay === 1 : true;

  return (
    <div className="h-full flex flex-col select-none overflow-hidden bg-[var(--color-bg)]">

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3">

        {/* Row 1: location | rain label */}
        <div className="flex mb-2">
          <span className="w-1/2 text-xs font-mono uppercase tracking-widest text-[var(--color-muted)] opacity-70 truncate">
            {data.locationName}{!isToday ? ` · ${day.date}` : ''}
          </span>
          {day.hourlyPrecip && day.hourlyPrecip.length > 0 && (
            <span className="w-1/2 text-xs font-mono uppercase tracking-widest text-[var(--color-muted)] opacity-70 pl-3">rain %</span>
          )}
        </div>

        {/* Row 2: icon+temp+condition | bars */}
        <div className="flex items-center">
          <div className="w-1/2 flex items-center gap-4 min-w-0">
            <div className="text-[var(--color-accent)] flex-shrink-0" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1 }}>
              <i className={`wi ${getIconClass(displayWeatherCode, displayIsDay)}`} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[var(--color-fg)] font-bold leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                {displayTemp}°{unit}
              </span>
              <span className="text-[var(--color-muted)] text-sm capitalize truncate mt-0.5">
                {displayCondition}
              </span>
            </div>
          </div>
          {day.hourlyPrecip && day.hourlyPrecip.length > 0 && (
            <div className="w-1/2 pl-3" style={{ height: 'clamp(3rem, 8vw, 5rem)' }}>
              <RainBars hourlyPrecip={day.hourlyPrecip} />
            </div>
          )}
        </div>

        {/* Row 3: stats | time labels */}
        <div className="flex mt-3">
          <div className="w-1/2 flex flex-wrap gap-x-4 gap-y-0.5 font-mono text-xs text-[var(--color-muted)]">
            {isToday ? (
              <>
                <span><span className="opacity-60">feels </span><span className="text-[var(--color-fg)]">{convertTemp(data.current.feelsLike, unit)}°</span></span>
                <span><span className="opacity-60">wind </span><span className="text-[var(--color-fg)]">{data.current.windSpeed} mph</span></span>
                <span><span className="opacity-60">precip </span><span className="text-[var(--color-fg)]">{data.current.precipProb}%</span></span>
              </>
            ) : (
              <span><span className="opacity-60">precip </span><span className="text-[var(--color-fg)]">{day.precipProb}%</span></span>
            )}
            {day.uvIndex > 0 && (
              <span><span className="opacity-60">uv </span><span className="text-[var(--color-fg)]">{day.uvIndex}</span></span>
            )}
            {day.pollenGrass != null && day.pollenGrass > 0 && (
              <span><span className="opacity-60">pollen </span><span className="text-[var(--color-fg)]">{pollenLabel(day.pollenGrass)}</span></span>
            )}
          </div>
          {day.hourlyPrecip && day.hourlyPrecip.length > 0 && (
            <div className="w-1/2 pl-3 flex justify-between font-mono text-xs text-[var(--color-muted)] opacity-50">
              <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-[var(--color-border)] opacity-30 flex-shrink-0" />

      {/* ── 7-day forecast (clickable) ── */}
      {data.dailyForecast && data.dailyForecast.length > 0 && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-2 py-2">
          <div className="flex h-full gap-1 min-w-0">
            {data.dailyForecast.map((d, i) => (
              <div
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`flex flex-col items-center justify-between flex-1 min-w-[2.5rem] px-1 py-1.5 rounded font-mono cursor-pointer transition-colors ${
                  i === selectedDay
                    ? 'bg-[var(--color-hover)]'
                    : 'hover:bg-[var(--color-hover)]'
                }`}
              >
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] opacity-70">
                  {d.date}
                </span>
                <div className="my-1 text-[var(--color-accent)]" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', lineHeight: 1 }}>
                  <i className={`wi ${getIconClass(d.weatherCode, true)}`} />
                </div>
                <span className="text-[11px] font-bold tabular-nums text-[var(--color-fg)]">
                  {convertTemp(d.tempMax, unit)}°
                </span>
                <span className="text-[10px] tabular-nums text-[var(--color-muted)] opacity-60">
                  {convertTemp(d.tempMin, unit)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Inline icon class helper
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
