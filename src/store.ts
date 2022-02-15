// TODO: create special case for array stores, to add remove items without subscrption

export class Store<T> {
  public static createStore<T>(initValue: InitValue<T>): Store<T> {
    const value = typeof initValue === "function" ? initValue() : initValue;

    return new Store<T>(value);
  }

  private constructor(initValue: T) {
    this._value = initValue;
  }

  private _value: T;
  private _subscribers = new Set<SubscriberFn<T>>();

  public get currentValue() {
    return this._value;
  }

  public subscribe(fn: SubscriberFn<T>): () => void {
    this._subscribers.add(fn);
    fn(this._value);

    return () => {
      this._subscribers.delete(fn);
    };
  }

  public update(value: T): void {
    if (Array.isArray(value)) {
      this._value = [...value] as any;
    } else if (typeof value === "object") {
      this._value = { ...value };
    } else {
      this._value = value;
    }
    this._subscribers.forEach((s) => s(this._value));
  }
}

type SubscriberFn<T> = (value: T) => void;
type InitValue<T> = T extends any ? T | (() => T) : never;
