import { HudModel } from '../daily-hud/daily-hud.types';

// Define the shape of the UserState
export interface State {
  currentUser: null | User;
  favFoods: [];
  createdFoods: [];
}

// Define the shape of User object
export interface User {
  a: object;
  c: CarbSettings;
  d: Diet;
  e: string;
  h: HudModel;
  m: Membership;
  n: string;
  s: ScheduledEntries;
  w: WaterSettings;
  id: string;
}

// Define the user's carb settings types
export type CarbSettings = 'n' | 't';

// Define the user's membership types
export type Membership = 's' | 'p';

// Define the shape of the user's scheduled entries object
export interface ScheduledEntries {
  e: [];
  f: [];
}

// Define the shape of the user's water settings object
export interface WaterSettings {
  e: boolean;
  g: number;
  u: UnitTypes;
}

export type UserId = string;

export type UnitTypes = 'c' | 'm' | 'o';

// Define the shape of the user's diet settings object
export interface Diet {
  c: null | number;
  d: null | number;
  e: number;
  f: number;
  k: null | number;
  p: number;
}

// Define action type names
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_FAV_FOODS = 'SET_FAV_FOODS';
export const SET_CREATED_FOODS = 'SET_CREATED_FOODS';

// Define action types
export interface SetCurrentUser {
  type: typeof SET_CURRENT_USER;
  payload: User;
}

export interface SetFavFoods {
  type: typeof SET_FAV_FOODS;
  payload: [];
}

export interface SetCreatedFoods {
  type: typeof SET_CREATED_FOODS;
  payload: [];
}

// Define all possible action types
export type Actions = SetCurrentUser | SetFavFoods | SetCreatedFoods;
