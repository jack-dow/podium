import resolveConfig from 'tailwindcss/resolveConfig';
import config from '../../tailwind.config.js';

export const TWConfig = resolveConfig(config);
export const TWTheme = TWConfig.theme;
