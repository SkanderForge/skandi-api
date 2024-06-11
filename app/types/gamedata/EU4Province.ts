export type EU4Province = {
  id: number
  name: string
  owner: string
  controller: string
  institutions: number[]
  religion: string
  trade_goods: string
  base_production: number
  base_tax: number
  base_manpower: number
  expand_infrastructure: number
  country_improve_count: CountryImproveCount
}

export type EU4ProvinceData = {
  flags: Flags
  variables: EU4ProvinceVariables
  name: string
  owner: string
  controller: string
  previous_controller: string
  seat_in_parliament: SeatInParliament
  institutions: number[]
  cores: string[]
  trade: string
  center_of_religion: string
  unit: RebelFaction
  original_culture: string
  native_culture: string
  culture: string
  religion: string
  original_religion: string
  capital: string
  is_city: string
  garrison: number
  base_tax: number
  original_tax: number
  base_production: number
  base_manpower: number
  likely_rebels: string
  trade_goods: string
  ub: string
  buildings: Building
  building_builders: Building
  great_projects: string[]
  history: EU4ProvinceHistory
  discovery_dates2: { [key: string]: string }
  discovery_religion_dates2: { [key: string]: string }
  discovered_by: string[]
  country_improve_count: CountryImproveCount
  modifier: Modifier[]
  diplomacy_construction: DiplomacyConstruction[]
  fort_influencing: number
  trade_power: number
  rebel_faction: RebelFaction
  center_of_trade: number
  expand_infrastructure: number
}

export type Building = {
  workshop: string
  barracks: string
  shipyard: string
  dock: string
  trade_depot: string
}

export type CountryImproveCount = {
  tag: string[]
  val: number[]
}

export type DiplomacyConstruction = {
  start_date: string
  total: number
  original_total: number
  date: string
  envoy: number
  country: string
  actor: string
  recipient: string
  from_province: number
  to_province: number
  once: string
  action_token: string
}

export type Flags = {
  extended_burgher_privileges: string
  monument_neglected_monument_flag: string
}

export type EU4ProvinceHistory = {
  owner: string
  add_core: string
  capital: string
  is_city: string
  culture: string
  religion: string
  hre: string
  base_tax: number
  base_production: number
  trade_goods: string
  base_manpower: number
  discovered_by: string[]
  extra_cost: number
}

export type Advisor = {
  name: string
  type: string
  skill: number
  location: number
  culture: string
  religion: string
  date: string
  hire_date?: string
  id: RebelFaction
}

export type RebelFaction = {
  id: number
  type: number
}

export type Modifier = {
  modifier: string
  date: string
  permanent?: string
}

export type SeatInParliament = {
  bribe: string
}

export type EU4ProvinceVariables = {
  [key: string]: number
}
