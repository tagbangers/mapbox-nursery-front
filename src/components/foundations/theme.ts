import * as styledComponents from 'styled-components'

export type Color = string

enum Elevation {
  MENU = 10,
  BACKDROP,
  MODAL,
  GLOBAL_LOADER,
  HELP,
}

export interface ITheme {
  color: {
    brand: {
      primary: Color
    }
    neutral: {
      900: Color
      800: Color
      700: Color
      600: Color
      500: Color
      400: Color
      300: Color
      200: Color
      100: Color
      50: Color
    }
    semantics: {
      invalid: Color
      progress: Color
      marked: Color
      danger: Color
      success: Color
      info: Color
    }
    black: Color
    white: Color
    backdrop: Color
    disabled: Color
    shadow: Color
  }
  spacing: (...args: number[]) => string
  elevation: typeof Elevation
  shape: {
    radius: {
      rg: number
      lg: number
    }
  }
  font: {
    size: {
      xs: string
      sm: string
      rg: string
      md: string
      lg: string
      xl: string
      xxl: string
      xxxl: string
    }
    family: {
      base: string
    }
  }
}

const SPACE_UNIT = 8
const spacing = (...args: number[]): string => {
  const unit = (v: number) => v * SPACE_UNIT
  switch (args.length) {
    case 1:
      return `${unit(args[0])}px`
    case 2:
      return [0, 1].map(n => `${args[n] * SPACE_UNIT}px`).join(' ')
    case 3:
      return [0, 1, 2].map(n => `${args[n] * SPACE_UNIT}px`).join(' ')
    case 4:
      return [0, 1, 2, 3].map(n => `${args[n] * SPACE_UNIT}px`).join(' ')
    default:
      return 'auto auto'
  }
}

const baseFontFamily =
  '"Noto Sans JP", "SF Pro JP","SF Pro Display","SF Pro Icons","Hiragino Kaku Gothic Pro","ヒラギノ角ゴ Pro W3","メイリオ","Meiryo","ＭＳ Ｐゴシック","Helvetica Neue","Helvetica","Arial",sans-serif'

export const theme: ITheme = {
  color: {
    brand: {
      primary: '#ED2024',
    },
    neutral: {
      900: '#212121',
      800: '#424242',
      700: '#616161',
      600: '#757575',
      500: '#9E9E9E',
      400: '#BDBDBD',
      300: '#E0E0E0',
      200: '#EEEEEE',
      100: '#F5F5F5',
      50: '#FAFAFA',
    },
    semantics: {
      invalid: '#8B91A1',
      info: '#007AE9',
      progress: '#00F5FF',
      marked: '#F7ACFF',
      danger: '#CC5660',
      success: '#1CC577',
    },
    black: '#000',
    white: '#fff',
    backdrop: 'rgba(0, 0, 0, 0.3)',
    shadow: 'rgba(0, 0, 0, 0.2)',
    disabled: '#d0d0d0',
  },
  elevation: Elevation,
  spacing,
  shape: {
    radius: {
      rg: 6,
      lg: 12,
    },
  },
  font: {
    // based on 1.333 - Perfect Fourth
    size: {
      xs: '0.563em',
      sm: '0.75em',
      rg: '1em',
      md: '1.333em',
      lg: '1.777em',
      xl: '2.369em',
      xxl: '3.157em',
      xxxl: '4.209em',
    },
    family: {
      base: baseFontFamily,
    },
  },
}

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<ITheme>

export default styled
export { css, createGlobalStyle, keyframes, ThemeProvider }
