import { mScale } from '../../utils'

export const fonts = {
	regular: 'Inter',
}

export const sizes = {
	font: {
		xxs: mScale(9),
		xs: mScale(11),
		sm: mScale(13),
		rg: mScale(14),
		md: mScale(15),
		lg: mScale(16),
		xl: mScale(18),
		xxl: mScale(20),
		xxxl: mScale(22),
	},
	fontWeight: {
		400: '400' as const,
		500: '500' as const,
		600: '600' as const,
		700: '700' as const,
	},
	spacing: {
		xs: mScale(4),
		sm: mScale(8),
		md: mScale(12),
		lg: mScale(16),
		xl: mScale(24),
		xxl: mScale(32),
	},
	radius: {
		sm: 4,
		md: 8,
		lg: 12,
		xl: 16,
	},
}

export const typography = {
	body: {
		'base': {
			fontFamily: fonts.regular,
			fontSize: 16,
			fontWeight: 400 as const,
			lineHeight: 20,
			letterSpacing: 0,
		},
		'base-medium': {
			fontFamily: fonts.regular,
			fontSize: 16,
			fontWeight: 500 as const,
			lineHeight: 20,
			letterSpacing: 0,
		},
		'base-semibold': {
			fontFamily: fonts.regular,
			fontSize: 16,
			fontWeight: 600 as const,
			lineHeight: 20,
			letterSpacing: 0,
		},
		'sm': {
			fontFamily: fonts.regular,
			fontSize: 14,
			fontWeight: 400 as const,
			lineHeight: 18,
			letterSpacing: 0,
		},
		'sm-medium': {
			fontFamily: fonts.regular,
			fontSize: 14,
			fontWeight: 500 as const,
			lineHeight: 18,
			letterSpacing: 0,
		},
		'sm-semibold': {
			fontFamily: fonts.regular,
			fontSize: 14,
			fontWeight: 600 as const,
			lineHeight: 18,
			letterSpacing: 0,
		},
		'xs': {
			fontFamily: fonts.regular,
			fontSize: 12,
			fontWeight: 400 as const,
			lineHeight: 16,
			letterSpacing: 0,
		},
		'xs-medium': {
			fontFamily: fonts.regular,
			fontSize: 12,
			fontWeight: 500 as const,
			lineHeight: 16,
			letterSpacing: 0,
		},
		'xs-semibold': {
			fontFamily: fonts.regular,
			fontSize: 12,
			fontWeight: 600 as const,
			lineHeight: 16,
			letterSpacing: 0,
		},
	},
	heading: {
		h1: {
			fontFamily: fonts.regular,
			fontSize: 36,
			fontWeight: 800 as const,
			lineHeight: 48,
			letterSpacing: 0,
		},
		h2: {
			fontFamily: fonts.regular,
			fontSize: 28,
			fontWeight: 700 as const,
			lineHeight: 36,
			letterSpacing: 0,
		},
		h3: {
			fontFamily: fonts.regular,
			fontSize: 20,
			fontWeight: 600 as const,
			lineHeight: 25,
			letterSpacing: 0,
		},
		h4: {
			fontFamily: fonts.regular,
			fontSize: 18,
			fontWeight: 600 as const,
			lineHeight: 22,
			letterSpacing: 0,
		},
	},
}
