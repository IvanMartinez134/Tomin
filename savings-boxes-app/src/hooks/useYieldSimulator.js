/**
 * useYieldSimulator.js
 * Hook personalizado para simular el rendimiento (yield) de las cajas de ahorro
 * durante la demo del hackathon
 */

import { useState, useEffect } from 'react';
import { APY_CONFIG } from '../data/mockData';

/**
 * Hook que simula el incremento del balance por APY
 *
 * @param {number} initialBalance - Balance inicial
 * @param {number} apy - APY en porcentaje (ej: 8.5 para 8.5%)
 * @param {boolean} isActive - Si está activo el simulador
 * @returns {number} Balance actual con rendimiento simulado
 */
export const useYieldSimulator = (initialBalance, apy = APY_CONFIG.base, isActive = true) => {
  const [currentBalance, setCurrentBalance] = useState(initialBalance);

  useEffect(() => {
    if (!isActive || !initialBalance || initialBalance <= 0) {
      setCurrentBalance(initialBalance);
      return;
    }

    // Calcular el incremento por intervalo
    // Para la demo, usamos un multiplicador para que sea visible
    const secondsInYear = 365 * 24 * 60 * 60;
    const intervalSeconds = APY_CONFIG.updateIntervalMs / 1000;
    const ratePerInterval = (apy / 100) / (secondsInYear / intervalSeconds);

    // Aplicar multiplicador para que sea visible en la demo
    const effectiveRate = ratePerInterval * APY_CONFIG.demoMultiplier;

    const interval = setInterval(() => {
      setCurrentBalance((prevBalance) => {
        const increment = prevBalance * effectiveRate;
        const newBalance = prevBalance + increment;

        // Logging para debugging (puedes comentar en producción)
        if (Math.random() < 0.1) { // Log 10% de las veces para no saturar
          console.log(`📈 Yield simulado: +$${increment.toFixed(4)} (Total: $${newBalance.toFixed(2)})`);
        }

        return newBalance;
      });
    }, APY_CONFIG.updateIntervalMs);

    return () => clearInterval(interval);
  }, [initialBalance, apy, isActive]);

  return currentBalance;
};

/**
 * Hook para simular el rendimiento de múltiples cajas
 *
 * @param {Array} boxes - Array de cajas de ahorro
 * @param {boolean} isActive - Si está activo el simulador
 * @returns {Array} Array de cajas con balances actualizados
 */
export const useMultipleBoxesYield = (boxes, isActive = true) => {
  const [updatedBoxes, setUpdatedBoxes] = useState(boxes);

  useEffect(() => {
    if (!isActive || !boxes || boxes.length === 0) {
      setUpdatedBoxes(boxes);
      return;
    }

    const secondsInYear = 365 * 24 * 60 * 60;
    const intervalSeconds = APY_CONFIG.updateIntervalMs / 1000;

    const interval = setInterval(() => {
      setUpdatedBoxes((prevBoxes) =>
        prevBoxes.map((box) => {
          const ratePerInterval = (box.apy / 100) / (secondsInYear / intervalSeconds);
          const effectiveRate = ratePerInterval * APY_CONFIG.demoMultiplier;
          const increment = box.currentBalance * effectiveRate;

          return {
            ...box,
            currentBalance: box.currentBalance + increment,
          };
        })
      );
    }, APY_CONFIG.updateIntervalMs);

    return () => clearInterval(interval);
  }, [boxes, isActive]);

  return updatedBoxes;
};

/**
 * Hook para calcular el rendimiento acumulado total
 *
 * @param {number} initialTotal - Total inicial
 * @param {number} currentTotal - Total actual
 * @returns {object} Objeto con yieldAmount y yieldPercentage
 */
export const useYieldStats = (initialTotal, currentTotal) => {
  const yieldAmount = currentTotal - initialTotal;
  const yieldPercentage = initialTotal > 0 ? (yieldAmount / initialTotal) * 100 : 0;

  return {
    yieldAmount: Math.max(0, yieldAmount),
    yieldPercentage: Math.max(0, yieldPercentage),
  };
};
