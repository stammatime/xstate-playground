import { createMachine } from "xstate";

// The hierarchical (recursive) schema for the states
interface LightStateSchema {
  duration: number;
  type: string;
  states: {
    green: unknown;
    yellow: unknown;
    red: {
      states: {
        walk: unknown;
        wait: unknown;
        stop: unknown;
      };
    };
  };
}

// The events that the machine handles
type LightEvent =
  | { type: "TIMER"; value: string; context: LightContext }
  | { type: "POWER_OUTAGE"; value: string; context: LightContext }
  | {
      type: "PED_COUNTDOWN";
      value: string;
      context: LightContext;
      duration: number;
    };

// The context (extended state) of the machine
interface LightContext {
  elapsed: number;
}

export const lightMachine = createMachine<
  LightContext,
  LightStateSchema,
  LightEvent
>({
  key: "light",
  initial: "green",
  context: { elapsed: 0 },
  states: {
    green: {
      on: {
        TIMER: { target: "yellow" },
        POWER_OUTAGE: { target: "red" },
      },
    },
    yellow: {
      on: {
        TIMER: { target: "red" },
        POWER_OUTAGE: { target: "red" },
      },
    },
    red: {
      on: {
        TIMER: { target: "green" },
        POWER_OUTAGE: { target: "red" },
      },
      initial: "walk",
      states: {
        walk: {
          on: {
            PED_COUNTDOWN: { target: "wait" },
          },
        },
        wait: {
          on: {
            PED_COUNTDOWN: {
              target: "stop",
              cond: (context, event) => {
                return event.duration === 0 && context.elapsed > 0;
              },
            },
          },
        },
        stop: {
          // Transient transition
          always: {
            target: "#light.green",
          },
        },
      },
    },
  },
});
