'use client';

import { useSyncExternalStore } from 'react';
import type { RoadmapKey } from './content';

/**
 * What this browser remembers about its visitor: whether they joined, their
 * reference, their locked vote. Stored locally, sanitised on read, shared
 * across components through one tiny external store.
 */
export type CrewState = {
  joined: boolean;
  name: string;
  ref: number | null;
  vote: RoadmapKey | null;
  confirmed: boolean;
  waitlisted: boolean;
  applied: boolean;
};

const KEY = 'invi.state.v5';
const VOTES: RoadmapKey[] = ['hair-reset', 'body-mist', 'shaving-skin', 'body-wash'];
const EMPTY: CrewState = { joined: false, name: '', ref: null, vote: null, confirmed: false, waitlisted: false, applied: false };

let state: CrewState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}') as Partial<CrewState>;
    state = {
      joined: raw.joined === true,
      name: typeof raw.name === 'string' ? raw.name.slice(0, 60) : '',
      ref: Number.isFinite(raw.ref) && (raw.ref as number) > 0 ? (raw.ref as number) : null,
      vote: raw.vote && VOTES.includes(raw.vote) ? raw.vote : null,
      confirmed: raw.confirmed === true && !!raw.vote && VOTES.includes(raw.vote),
      waitlisted: raw.waitlisted === true,
      applied: raw.applied === true,
    };
  } catch {
    state = EMPTY;
  }
}

export function setCrew(patch: Partial<CrewState>) {
  load();
  state = { ...state, ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  listeners.forEach((l) => l());
}

export function newRef() {
  return Math.floor(Math.random() * 9000) + 1000;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useCrew(): CrewState {
  return useSyncExternalStore(
    subscribe,
    () => { load(); return state; },
    () => EMPTY,
  );
}
