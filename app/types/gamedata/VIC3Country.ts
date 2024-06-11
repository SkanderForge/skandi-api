import { ICountryData } from '../interfaces.js'

export class EU4Country implements ICountryData {
  public tag: string
  public monthly_income: string

  getFlagUrl(): string {
    return ''
  }
  getLocalizedName(): string {
    return ''
  }
}
