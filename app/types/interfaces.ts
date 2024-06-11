export interface ICountryData {
  tag: string

  getLocalizedName(): string
  getFlagUrl(): string
}

export interface IProvinceData {
  id: string | number
}
