export interface ICurrencyLayers {
    success: boolean
    timestamp: number
    source: string
    quotes: ICurrValue
}

export interface ICurrValue {
    quotes: ICurrQuotes;
}
export type ICurrQuotes = {
    [key: string]: number;
}