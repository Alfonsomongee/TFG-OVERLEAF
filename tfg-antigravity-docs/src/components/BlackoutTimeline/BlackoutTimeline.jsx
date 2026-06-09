import React from 'react';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function BlackoutTimeline() {
  const lightImage = useBaseUrl('/figuras/timeline-light.png');
  const darkImage = useBaseUrl('/figuras/timeline-dark.png');

  return (
    <figure style={{ margin: '2rem 0', padding: 0 }}>
      <ThemedImage
        alt="Línea temporal comparativa de la restauración RTE / Francia y REN / Portugal tras el apagón ibérico del 28 de abril de 2025"
        sources={{
          light: lightImage,
          dark: darkImage,
        }}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </figure>
  );
}