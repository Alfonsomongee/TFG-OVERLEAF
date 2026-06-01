import React from 'react';
// Import original MDX components
import MDXComponents from '@theme-original/MDXComponents';
import ChartCard from '@site/src/components/ChartCard';
import GlitchTitle from '@site/src/components/GlitchTitle';
import ForensicReveal from '@site/src/components/ForensicReveal';
import GlossaryLink from '@site/src/components/GlossaryLink';
import ForensicNarrative from '@site/src/components/GaleriaForense/ForensicNarrative';
import { ForensicTable } from '@site/src/components/ForensicUI/Primitives';
import Collapsible from '@site/src/components/Collapsible';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Add our custom components globally so we don't have to import them in every .mdx
  ChartCard,
  GlitchTitle,
  ForensicReveal,
  GlossaryLink,
  ForensicNarrative,
  ForensicTable,
  Collapsible,
};
