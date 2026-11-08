import React from 'react';
import SmartCommandPalette from '../navigation/SmartCommandPalette.jsx';

/**
 * CommandPaletteModal
 * Upgraded to SmartCommandPalette with full fuzzy navigation, role-based filtering,
 * curriculum lesson search, HSK exam search, and hybrid dictionary integration.
 */
export default function CommandPaletteModal(props) {
  return <SmartCommandPalette {...props} />;
}
