import React from 'react';
// Import original MDX components
import MDXComponents from '@theme-original/MDXComponents';
import ChartCard from '@site/src/components/ChartCard';
import GlitchTitle from '@site/src/components/GlitchTitle';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Add our custom components globally so we don't have to import them in every .mdx
  ChartCard,
  GlitchTitle,
};
