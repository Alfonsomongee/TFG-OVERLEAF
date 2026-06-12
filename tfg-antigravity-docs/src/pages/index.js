import React from 'react';
import Layout from '@theme/Layout';
import HomeHero from '@site/src/components/HomeHero';
import HomeArgument from '@site/src/components/HomeArgument';
import HomeReadingPaths from '@site/src/components/HomeReadingPaths';
import HomeAnnexes from '@site/src/components/HomeAnnexes';
import HomeChatInvite from '@site/src/components/HomeChatInvite';

export default function Home() {
  return (
    <Layout
      title="Análisis forense del apagón ibérico del 28-A"
      description="Reconstrucción técnica, económica y social de la mayor perturbación del área síncrona continental europea. 170 evidencias, 10 anexos, 28 simuladores interactivos."
    >
      <HomeHero />
      <HomeArgument />
      <HomeReadingPaths />
      <HomeAnnexes />
      <HomeChatInvite />
    </Layout>
  );
}
