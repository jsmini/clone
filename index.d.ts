export as namespace jsminiClone;

export function clone<T>(x: T): T;

export function cloneJSON<T>(x: T, errOrDef?: any): T;

export function cloneLoop<T>(x: T): T;

export function cloneForce<T>(x: T): T;
