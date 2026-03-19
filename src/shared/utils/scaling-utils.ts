import { Dimensions } from 'react-native'

const guidelineBaseWidth = 360
const guidelineBaseHeight = 640

const { width, height } = Dimensions.get('window')
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width]

const hScaleRatio = shortDimension / guidelineBaseWidth

const hScale = (size: number): number => (shortDimension / guidelineBaseWidth) * size
const vScale = (size: number): number => (longDimension / guidelineBaseHeight) * size
const mScale = (size: number, factor = 0.3): number => size + (hScale(size) - size) * factor

export { hScale, vScale, mScale, hScaleRatio }
