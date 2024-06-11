import { GenericStringToNumber } from '../index.js'

export type EU4Country = Partial<{
  monthly_income?: number
  total_development?: number
  real_development?: number
  idea_groups?: ActiveIdeaGroups
  tag: string
  map_color: number[]
  country_name: string
  human: boolean
  was_human: boolean
  primary_culture: string
  technology: Technology
  great_power_score: number
  treasury: number
  army_tradition: number
  navy_tradition: number
  manpower: number
  max_manpower: number
  losses: EU4DetailedLosses
  powers: Powers
  produced_goods_value_detailed: GenericStringToNumber
  num_of_goods_produced_detailed: GenericStringToNumber
  traded_detailed: GenericStringToNumber
  num_of_subunits: DetailedNumSubunits
  flag: string,
}>
type Powers = {
  adm: number
  dip: number
  mil: number
}

type DetailedNumSubunits = {
  infantry: number
  cavalry: number
  artillery: number
  heavy_ship: number
  light_ship: number
  galley: number
  transport: number

  total_land: number
  total_sea: number
}

export type EU4DetailedLosses = Partial<{
  infantry_battles: number
  infantry_attrition: number
  cavalry_battles: number
  cavalry_attrition: number
  artillery_battles: number
  artillery_attrition: number
  total_battles: number
  total_attrition: number
  total: number
}>

//Auto generated
export type EU4CountryData = {
  was_player: string,
  human: string,
  great_power_score: number
  has_set_government_name?: string
  government_rank?: number
  government_name?: string
  continent?: number[]
  national_focus?: string
  institutions?: number[]
  first_province_with_institutions?: number[]
  num_of_age_objectives?: number
  last_focus_move?: string
  history?: History
  flags?: object
  variables?: Variables
  capital?: number
  original_capital?: number
  trade_port?: number
  base_tax?: number
  development?: number
  raw_development: number
  capped_development?: number
  realm_development?: number
  used_governing_capacity?: number
  cached_liberty_desire?: number
  isolationism?: number
  initialized_rivals?: string
  recalculate_strategy?: string
  colors: Colors
  dirty_colony?: string
  primary_culture?: string
  dominant_culture?: string
  accepted_culture?: string
  graphical_culture?: string
  religion?: string
  dominant_religion?: string
  preferred_religion?: string
  technology_group?: string
  unit_type?: string
  technology?: Technology
  estate?: Estate[]
  interactions_last_used?: Array<Array<number | string>>
  highest_possible_fort?: number
  highest_possible_fort_building?: string
  transfer_home_bonus?: number
  overlord?: string
  rebel_threat?: number
  our_spy_network?: string
  force_converted?: string
  new_monarch?: string
  last_election?: string
  navy_strength?: number
  tariff?: number
  num_of_cities?: number
  num_of_provinces_in_states?: number
  num_owned_home_cores?: number
  total_war_worth?: number
  num_of_rebel_controlled_provinces?: number
  num_of_rebel_armies?: number
  non_overseas_development?: number
  num_of_controlled_cities?: number
  num_of_ports?: number
  num_of_non_cores?: number
  num_of_core_ports?: number
  num_of_total_ports?: number
  num_subunits?: NumSubunits
  num_subunits_type_and_cat?: NumSubunitsTypeAndCat
  forts?: number
  inland_sea_ratio?: number
  average_unrest?: number
  average_effective_unrest?: number
  average_autonomy?: number
  average_autonomy_above_min?: number
  average_home_autonomy?: number
  friend_tags?: string[]
  num_of_buildings_indexed?: { [key: string]: number }
  produced_goods_value?: number[]
  num_of_goods_produced?: number[]
  traded?: number[]
  num_of_religions_indexed?: NumOfReligions
  num_of_religions_dev?: NumOfReligions
  num_of_leaders?: number[]
  num_of_leaders_with_traits?: number[]
  num_of_free_leaders?: number[]
  border_pct?: { [key: string]: number }
  border_sit?: { [key: string]: number }
  border_provinces?: number[]
  neighbours?: string[]
  home_neighbours?: string[]
  core_neighbours?: string[]
  score_rating?: number[]
  score_rank?: number[]
  age_score?: number[]
  vc_age_score?: number[]
  score_place?: number
  prestige?: number
  stability?: number
  treasury?: number
  estimated_monthly_income?: number
  inflation_history?: number[]
  opinion_cache?: number[]
  under_construction?: number[]
  under_construction_queued?: number[]
  total_count?: number[]
  owned_provinces?: number[]
  controlled_provinces?: number[]
  core_provinces?: number[]
  update_opinion_cache?: string
  needs_refresh?: string
  cb?: Cb
  needs_rebel_unit_refresh?: string
  rebels_in_country?: number[]
  land_maintenance?: number
  naval_maintenance?: number
  colonial_maintenance?: number
  missionary_maintenance?: number
  army_tradition?: number
  navy_tradition?: number
  last_war_ended?: string
  num_uncontested_cores?: number
  ledger?: Ledger
  loan_size?: number
  estimated_loan?: number
  religious_unity?: number
  devotion?: number
  meritocracy?: number
  papal_influence?: number
  legitimacy?: number
  mercantilism?: number
  splendor?: number
  active_idea_groups?: ActiveIdeaGroups
  government?: Government
  merchants?: Diplomats
  missionaries?: Missionaries
  diplomats?: Diplomats
  manpower?: number
  max_manpower?: number
  sailors?: number
  max_sailors?: number
  sub_unit?: SubUnit
  mercenary_company?: MercenaryCompany[]
  army?: Army
  navy?: Navy[]
  active_relations?: { [key: string]: ActiveRelation }
  decision_seed?: number
  monarch?: IDClass
  original_dynasty?: string
  inauguration?: string
  ai?: AI
  powers?: number[]
  blockaded_percent?: number
  losses?: Losses
  stability_reasons?: Array<number[]>
  historic_stats_cache?: HistoricStatsCache
  country_missions?: CountryMissions
  government_reform_progress?: number
}

export type ActiveIdeaGroups = {
  SWE_ideas?: number
}

export type ActiveRelation = {
  attitude?: Attitude
  trust_value?: number
  has_culture_group_claim?: string
  has_core_claim?: string
  opinion?: Opinion
  cached_sum?: number
  last_send_diplomat?: string
  spy_network?: number
  is_building_spy_network?: string
  has_changed?: string
}

export enum Attitude {
  AttitudeFriendly = 'attitude_friendly',
  AttitudeHostile = 'attitude_hostile',
  AttitudeLoyal = 'attitude_loyal',
  AttitudeNeutral = 'attitude_neutral',
}

export type Opinion = {
  modifier?: string
  date?: string
  current_opinion?: number
  expiry_date?: string
}

export type AI = {
  initialized?: string
  initialized_attitudes?: string
  static?: string
  personality?: string
  last_recalc_date?: string
  hre_interest?: string
  papacy_interest?: string
  needs_money?: string
  needs_money_for_ships?: string
  needs_buildings?: string
  needs_ships_2?: string
  powers?: number[]
  treasury?: number
  conquer_prov?: ConProv[]
  convert_prov?: ConProv
  building_prov?: BuildingProv[]
  threat?: Antagonize[]
  antagonize?: Antagonize[]
  befriend?: Antagonize[]
  defended_home_strait?: number
}

export type Antagonize = {
  id?: string
  value?: number
}

export type BuildingProv = {
  key?: Key
  id?: number
  value?: number
}

export enum Key {
  FarmEstate = 'farm_estate',
  Furnace = 'furnace',
  ImpressmentOffices = 'impressment_offices',
  Mills = 'mills',
  Plantations = 'plantations',
  Ramparts = 'ramparts',
  SoldierHouseholds = 'soldier_households',
  StateHouse = 'state_house',
  Textile = 'textile',
  Tradecompany = 'tradecompany',
  Weapons = 'weapons',
  Wharf = 'wharf',
}

export type ConProv = {
  id?: number
  value?: number
}

export type Army = {
  id?: IDClass
  name?: string
  previous?: number
  previous_war?: number
  location?: number
  regiment?: Regiment[]
  movement_progress_last_updated?: string
  graphical_culture?: string
  main_army?: string
  visible_to_ai?: string
}

export type IDClass = {
  id?: number
  type?: number
}

export type Regiment = {
  id?: IDClass
  name?: string
  home?: number
  type?: string
  morale?: number
}

export type Cb = {
  casus_bellis_refresh?: string
}

export type Colors = {
  revolutionary_colors?: number[]
  color?: number[]
  map_color: number[]
  country_color?: number[]
}

export type CountryMissions = {
  mission_slot?: Array<string[] | string>
}

export type Diplomats = {
  envoy?: Envoy[]
}

export type Envoy = {
  action?: number
  name?: string
  type?: number
  id?: number
}

export type Estate = {
  type?: string
  loyalty?: number
  territory?: number
  granted_privileges?: Array<string[]>
  active_influences?: number[]
}

export type Government = {
  government?: string
  reform_stack?: ReformStack
}

export type ReformStack = {
  reforms?: string[]
  history?: string[]
}

export type HistoricStatsCache = {
  starting_num_of_states?: number
  starting_development?: number
  starting_income?: number
}

export type History = {
  government?: string
  add_government_reform?: string
  technology_group?: string
  unit_type?: string
  primary_culture?: string
  religion?: string
  add_accepted_culture?: string
  capital?: number
  national_focus?: string
}

export type Ledger = {
  income?: number[]
  expense?: number[]
  lastmonthincome?: number
  lastmonthincometable?: number[]
  lastmonthexpense?: number
  lastmonthexpensetable?: number[]
  totalexpensetable?: number[]
  lastyearincome?: number[]
  lastyearexpense?: number[]
  last_months_recurring_income?: number
  last_months_recurring_expenses?: number
}

export type Losses = {
  members?: number[]
}

export type MercenaryCompany = {
  id?: IDClass
  tag?: string
  modifier?: number
  leader?: Leader
}

export type Leader = {
  name?: string
  type?: string
  mercenary?: string
  siege?: number
  maneuver?: number
  fire?: number
  shock?: number
  activation?: string
  birth_date?: string
  id?: IDClass
}

export type Missionaries = {
  envoy?: Envoy
}

export type Navy = {
  id?: IDClass
  name?: string
  previous?: number
  previous_war?: number
  location?: number
  ship?: Regiment[] | Regiment
  movement_progress_last_updated?: string
  graphical_culture?: string
  last_at_sea?: string
  active_fraction_last_month?: number
}

export type NumOfReligions = {
  '1'?: number
}

export type NumSubunits = {
  normal?: number
}

export type NumSubunitsTypeAndCat = {
  infantry?: NumSubunits
  cavalry?: NumSubunits
  light_ship?: NumSubunits
  galley?: NumSubunits
  transport?: NumSubunits
}

export type SubUnit = {
  infantry?: string
  cavalry?: string
  heavy_ship?: string
  light_ship?: string
  galley?: string
  transport?: string
}

export type Technology = {
  adm_tech?: number
  dip_tech?: number
  mil_tech?: number
}

export type Variables = {
  seize_land_counter?: number
  seize_land_effect_variable?: number
}
