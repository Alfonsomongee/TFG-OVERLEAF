import { useState, useEffect } from 'react';

/**
 * useRealData
 * Carga JSONs desde /data/processed/ con fallback a datos hardcodeados
 * Retorna: { demand, generationMix, price, balance, capacity, ready, errors }
 */

const FALLBACK_DATA = {
  demand: null,
  generationMix: null,
  price: null,
  balance: null,
  capacity: null,
};

export function useRealData() {
  const [data, setData] = useState(FALLBACK_DATA);
  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const loadedData = { ...FALLBACK_DATA };
      const errorList = [];

      const files = [
        { key: 'demand', path: '/data/processed/28A_demand.json' },
        { key: 'generationMix', path: '/data/processed/28A_generation_mix.json' },
        { key: 'price', path: '/data/processed/28A_price.json' },
        { key: 'balance', path: '/data/processed/28A_balance.json' },
        { key: 'capacity', path: '/data/processed/28A_capacity.json' },
      ];

      for (const file of files) {
        try {
          const response = await fetch(file.path);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          loadedData[file.key] = await response.json();
        } catch (err) {
          errorList.push(`${file.path}: ${err.message}`);
        }
      }

      setData(loadedData);
      setErrors(errorList);
      setReady(true);
    };

    fetchData();
  }, []);

  return { ...data, ready, errors };
}
