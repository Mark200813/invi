'use client';

import { useSyncExternalStore } from 'react';
import type { RoadmapKey } from './content';

/**
 * What this browser remembers about its visitor: whether they joined, their
 * first name and reference, their locked vote, and which WhatsApp step they
 * are on. No email, phone, guardian details or age are ever kept here.
 *
 * It is a convenience for the visitor, not a record: anyone can edit it, so
 * it is sanitised on every read, and the real one-vote-per-member rule has to
 * live on the server once the database exists.
 */
export type WhatsAppAccess = 'link' | 'approval' | null;
export type CrewState = {
  joined: boolean;
  name: string;
  ref: number | null;
  vote: RoadmapKey | null;
  confirmed: boolean;
  waitlisted: boolean;
  applied: boolean;
  whatsapp: WhatsAppAccess;
};

const KEY = 'invi.state.v5';
const VOTES: RoadmapKey[] = ['hair-reset', 'body-mist', 'shaving-skin', 'body-wash'];
const EMPTY: CrewState = { joined: false, name: '', ref: null, vote: null, confirmed: false, waitlisted: false, applied: false, whatsapp: null };

let state: CrewState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function sanitise(raw: Partial<CrewState> | null): CrewState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return EMPTY;
  const ref = Number.isInteger(raw.ref) && (raw.ref as number) >= 1000 && (raw.ref as number) <= 9999 ? (raw.ref as number) : null;
  // every real join is given a reference: without one, it isn't a membership
  const joined = raw.joined === true && ref !== null;
  const vote = typeof raw.vote === 'string' && VOTES.includes(raw.vote) ? raw.vote : null;
  return {
    joined,
    name: typeof raw.name === 'string' ? raw.name.slice(0, 60) : '',
    ref: joined ? ref : null,
    vote: joined ? vote : null,
    // a locked vote only exists for a member with a vote
    confirmed: joined && raw.confirmed === true && !!vote,
    waitlisted: raw.waitlisted === true,
    applied: raw.applied === true,
    whatsapp: joined && (raw.whatsapp === 'link' || raw.whatsapp === 'approval') ? raw.whatsapp : null,
  };
}

function read() {
  try { state = sanitise(JSON.parse(localStorage.getItem(KEY) || 'null')); } catch { state = EMPTY; }
}

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  read();
  // another tab joined, voted or started again: follow it, so two tabs can
  // never each cast a vote or overwrite each other
  addEventListener('storage', (e) => {
    if (e.key !== KEY && e.key !== null) return;
    read();
    listeners.forEach((l) => l());
  });
}

/** The latest saved state, straight from storage (another tab may have changed it). */
export function readCrew(): CrewState {
  load();
  read();
  return state;
}

export function setCrew(patch: Partial<CrewState>) {
  load();
  read(); // the latest from any other tab first
  state = sanitise({ ...state, ...patch });
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  listeners.forEach((l) => l());
}

/** "Not you? Start again": forget this device's member entirely. */
export function clearCrew() {
  load();
  state = EMPTY;
  try { localStorage.removeItem(KEY); } catch {}
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
