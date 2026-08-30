'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useApp } from '@/lib/app-context';

interface EChartsWrapperProps {
  option: echarts.EChartsOption;
  height?: string | number;
  className?: string;
  onEvents?: Record<string, (params: any) => void>;
}

export const EChartsWrapper: React.FC<EChartsWrapperProps> = ({
  option,
  height = '350px',
  className = '',
  onEvents
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { theme } = useApp();

  useEffect(() => {
    if (!chartRef.current) return;

    // Dispose if already exists
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    const chart = echarts.init(chartRef.current, theme === 'dark' ? 'dark' : undefined, {
      renderer: 'canvas'
    });
    chartInstance.current = chart;

    // Attach events
    if (onEvents) {
      Object.entries(onEvents).forEach(([event, handler]) => {
        chart.on(event, handler);
      });
    }

    chart.setOption({
      backgroundColor: 'transparent',
      ...option
    });

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      chartInstance.current = null;
    };
  }, [theme]); // re-init when theme changes

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(
        {
          backgroundColor: 'transparent',
          ...option
        },
        { notMerge: false }
      );
    }
  }, [option]);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height }}
      className={`relative ${className}`}
    />
  );
};
