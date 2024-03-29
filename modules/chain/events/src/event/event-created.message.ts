export class EventCreatedMessage {
  static eventName = 'chain.event.created';

  constructor(props: Partial<EventCreatedMessage>) {
    Object.assign(this, props);
  }

  readonly id!: string;
  readonly blockHeight!: number;
  readonly parentId!: string;
  readonly parentType!: string;
  readonly sequence?: number;
  readonly contractId?: string;
  readonly name!: string;
  readonly data?: string;
  readonly impacted?: string[];
  readonly timestamp!: number;
  readonly publishedAt!: number;

  public toString(): string {
    return JSON.stringify(this);
  }
}
